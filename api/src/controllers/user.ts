import bcrypt from 'bcrypt';
import {CookieOptions, RequestHandler} from 'express';
import createHttpError from 'http-errors';
import UserModel from '../models/user';
import env from '../util/validateEnv';
const {S3Client, PutObjectCommand} = require('@aws-sdk/client-s3');
const fs = require('fs');
const jwt = require('jsonwebtoken');
// Imports the Google Cloud client library
const {Storage} = require('@google-cloud/storage');

const cookieSourceConfig: CookieOptions = env.CLIENT_DOMAIN.includes('http://localhost')
  ? {sameSite: 'lax'}
  : {sameSite: 'none', secure: true};

export const getUser: RequestHandler = async (req, res, next) => {
  const {token} = req.cookies;
  if (token) {
    jwt.verify(token, env.JWT_SECRET, {}, async (err: any, decodedUser: {id: any}) => {
      if (err) throw err;

      const user = await UserModel.findById(decodedUser.id).select('+email').exec();

      res.status(200).json(user);
    });
  } else {
    console.log('User token not found');
    res.json(null);
  }
};

interface LoginBody {
  email?: string;
  password?: string;
  userType: string;
}

export const login: RequestHandler<unknown, unknown, LoginBody, unknown> = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    if (!email || !password) {
      throw createHttpError(400, 'Parameters missing');
    }

    const user = await UserModel.findOne({email: email}).select('+password +email').exec();

    if (!user) {
      throw createHttpError(401, 'User not found');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw createHttpError(401, 'Invalid password');
    }

    jwt.sign(
      {
        email: user.email,
        id: user._id,
        name: user.fullname,
      },
      env.JWT_SECRET,
      {},
      (err: any, token: any) => {
        if (err) throw err;

        res.cookie('token', token, cookieSourceConfig).json(user);
      }
    );
  } catch (error) {
    next(error);
  }
};

interface RegisterBody extends LoginBody {
  fullname?: string;
  username?: string;
}

export const register: RequestHandler<unknown, unknown, RegisterBody, unknown> = async (req, res, next) => {
  const fullname = req.body.fullname;
  const email = req.body.email;
  const passwordRaw = req.body.password;
  const userType = req.body.userType;

  try {
    if (!fullname || !email || !passwordRaw) {
      throw createHttpError(400, 'Parameters missing');
    }

    const existingEmail = await UserModel.findOne({email: email}).exec();

    if (existingEmail) {
      throw createHttpError(409, 'A user with this email address already exists. Please log in instead.');
    }

    const username = fullname.replace(/\s+/g, '').toLowerCase() + Date.now();

    const passwordHashed = await bcrypt.hash(passwordRaw, 10);

    let createdUser = await UserModel.create({
      fullname: fullname.trim(),
      username,
      email: email.trim(),
      password: passwordHashed,
      credit: 10000,
      userType: userType.trim()
    });

    let newUser = await UserModel.findById(createdUser._id).select('-password').exec();
    if (!newUser) throw createHttpError(417, 'Unexpected Error, Investigation required');
    
    jwt.sign(
      {
        email: newUser.email,
        id: newUser._id,
        name: newUser.fullname,
      },
      env.JWT_SECRET,
      {},
      async (err: any, token: any) => {
        if (err) throw createHttpError(401, 'Could not verify token.');

        res.cookie('token', token, cookieSourceConfig).json(newUser);
      }
    );
  } catch (error) {
    next(error);
  }
};

export const logout: RequestHandler = (req, res, next) => {
  res.cookie('token', '', cookieSourceConfig).json(true);
};

export const uploadPhoto: RequestHandler<unknown, unknown, unknown, unknown> = async (req, res, next) => {
  const {token} = req.cookies;
  if (token) {
    jwt.verify(token, env.JWT_SECRET, {}, async (err: any, decodedUser: {id: any}) => {
      if (err) throw createHttpError(401, 'Could not verify token.');

      let picturePath = null;
      if (typeof req.files === 'object') {
        let values = Object.values(req.files);
        const user = await UserModel.findById(decodedUser.id);
        if (!user) throw new Error();

        const {path, originalname} = values[0];
        const sharp = require('sharp');
        const thumbnailLocalPath = './uploads/' + Date.now() + '.jpg';
        let thumbnailPath = '';

        sharp(path)
          .resize(150)
          .jpeg()
          .toFile(thumbnailLocalPath, async (err: Error, info: any) => {
            if (err) throw err;

            //   upload thumbnail to gcloud
            thumbnailPath = await uploadToGCloudStorage(thumbnailLocalPath, originalname);
            user.set('thumbnail', thumbnailPath);
          });

        //   upload photo to gcloud
        picturePath = await uploadToGCloudStorage(path, originalname);

        if (picturePath) {
          user.set('photo', picturePath);

          res.json(await user.save());
        } else {
          res.json(null);
        }
      }
    });
  }
};

// Need to login first using the command below
// gcloud auth application-default login
async function uploadToGCloudStorage(path: any, originalFileName: any) {
  // Creates a client
  const storage = new Storage();
  const bucket = env.GCLOUD_STORAGE_BUCKET;

  const parts = originalFileName.split('.');
  const ext = parts[parts.length - 1];
  const newFileName = Date.now() + '.' + ext;

  const generationMatchPrecondition = 0;

  const options = {
    destination: newFileName,
    preconditionOpts: {ifGenerationMatch: generationMatchPrecondition},
  };

  const res = await storage.bucket(bucket).upload(path, options);

  return `https://storage.cloud.google.com/${bucket}/${newFileName}`;
}

async function uploadToS3(path: any, originalFileName: any, mimetype: any) {
  const bucket = 'martiantourist-bucket';
  const client = new S3Client({
    region: 'us-east-2',
    credentials: {
      accessKeyId: env.S3_ACCESS_KEY,
      secretAccessKey: env.S3_SECRET_ACCESS_KEY,
    },
  });

  const parts = originalFileName.split('.');
  const ext = parts[parts.length - 1];
  const newFilename = Date.now() + '.' + ext;
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Body: fs.readFileSync(path),
      Key: newFilename,
      ContentType: mimetype,
      ACL: 'public-read',
    })
  );

  return `https://${bucket}.s3.amazonaws.com/${newFilename}`;
}

interface UserCredBody {
  fullname?: string;
  username?: string;
}

export const updateUserCredentials: RequestHandler<unknown, unknown, UserCredBody, unknown> = async (
  req,
  res,
  next
) => {
  const {token} = req.cookies;

  let {fullname, username} = req.body;

  function isAlphanumeric(str: string) {
    return str.match(/^[a-zA-Z0-9]+$/) !== null;
  }

  if (fullname === undefined || fullname.trim() === '') {
    delete req.body.fullname;
  } else if (!/[^a-zA-Z]/.test(fullname)) {
    throw createHttpError(400, 'Name must contain only alphabets');
  }
  if (username === undefined) {
    delete req.body.username;
  } else if (!isAlphanumeric(username) && username.trim() === '') {
    throw createHttpError(400, 'Username must be alphanumeric');
  }

  if (token) {
    jwt.verify(token, env.JWT_SECRET, {}, async (err: any, decodedUser: {id: any}) => {
      if (err) throw createHttpError(401, 'Could not verify token.');

      const userDoc = await UserModel.findById(decodedUser.id);
      if (!userDoc) throw new Error();

      try {
        userDoc.set(req.body);
        res.status(200).json(await userDoc.save());
      } catch (error) {
        console.log(error);
        res.json(error);
      }
    });
  } else {
    res.json(null);
  }
};

interface UserDataBody {
  location?: string;
  bio?: string;
}

export const updateUserProfile: RequestHandler<unknown, unknown, UserDataBody, unknown> = async (req, res, next) => {
  const {token} = req.cookies;

  let {bio, location} = req.body;

  const locations = [
    'olympus mons',
    'jezero',
    'gale',
    'gusev',
    'meridiani',
    'capri chasma',
    'coloe',
    'shalbatana',
    'valles marineris',
    'cavi angusti',
    'medusae fossae',
    'nicholson',
    'zunil',
    'milankovic',
    'terra sirenum',
    'eberswalde',
  ];

  if (bio === undefined || bio === '') {
    bio = '';
  } else if (location === undefined || !locations.includes(location)) {
    location = 'anon';
  }

  if (token) {
    jwt.verify(token, env.JWT_SECRET, {}, async (err: any, decodedUser: {id: any}) => {
      if (err) throw createHttpError(401, 'Could not verify token.');

      const userDoc = await UserModel.findById(decodedUser.id);
      if (!userDoc) throw new Error();

      userDoc.set({
        bio,
        location,
      });

      res.status(200).json(await userDoc.save());
    });
  } else {
    res.json(null);
  }
};

export const addCredit: RequestHandler<unknown, unknown, {credit: number}, unknown> = async (req, res, next) => {
  if (!req.body.credit) throw new Error();

  const {token} = req.cookies;

  if (token) {
    jwt.verify(token, env.JWT_SECRET, {}, async (err: any, decodedUser: {id: any}) => {
      if (err) throw createHttpError(401, 'Could not verify token.');

      const userDoc = await UserModel.findById(decodedUser.id);
      if (!userDoc) throw new Error();

      userDoc.set({
        credit: userDoc.credit + req.body.credit,
      });

      res.status(200).json(await userDoc.save());
    });
  } else {
    res.json(null);
  }
};

export const updateFriendship: RequestHandler<unknown, unknown, {friendId: string}, unknown> = async (
  req,
  res,
  next
) => {
  if (!req.body.friendId) throw new Error();

  const {token} = req.cookies;

  if (token) {
    jwt.verify(token, env.JWT_SECRET, {}, async (err: any, decodedUser: {id: any}) => {
      if (err) throw createHttpError(401, 'Could not verify token.');

      if (decodedUser.id === req.body.friendId) throw createHttpError(401, 'User and friend cannot have the same id');

      const userDoc = await UserModel.findById(decodedUser.id);
      if (!userDoc) throw new Error();

      const friendDoc = await UserModel.findById(req.body.friendId);
      if (!friendDoc) throw new Error();

      // remove friendship if already existing
      if (userDoc.friends.filter(f => f.userId === friendDoc._id)) {
        userDoc.friends = userDoc.friends.filter((friend) => friend.toString() !== friendDoc._id.toString());
        friendDoc.friends = friendDoc.friends.filter((friend) => friend.toString() !== userDoc._id.toString());
      }
      // else add friendship
      else {
        userDoc.friends.push({userId: friendDoc._id, name: friendDoc.fullname});
        friendDoc.friends.push({userId: userDoc._id, name: userDoc.fullname});
      }

      await friendDoc.save();

      res.status(200).json(await userDoc.save());
    });
  } else {
    res.json(null);
  }
};

export const deleteAccount: RequestHandler = async (req, res, next) => {
  const {token} = req.cookies;
  if (token) {
    jwt.verify(token, env.JWT_SECRET, {}, async (err: any, decodedUser: {id: any}) => {
      if (err) throw createHttpError(401, 'Could not verify token.');

      const user = await UserModel.findById(decodedUser.id).select('+email').exec();
      user?.deleteOne();

      res.sendStatus(202);
    });
  } else {
    console.log('User token not found');
    res.status(401);
  }
};
