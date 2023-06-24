import { RequestHandler } from "express";
import createHttpError from "http-errors";
import UserModel from "../models/user";
import UserDataModel from "../models/userData";
import DataModel from "../models/data";
import bcrypt from "bcrypt";
import { Types } from "mongoose";
import { email } from "envalid";
import env from "../util/validateEnv";

const jwt = require("jsonwebtoken");

const bcryptSalt = bcrypt.genSaltSync(10);



export const getUser: RequestHandler = async (req, res, next) => {

    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, env.JWT_SECRET, {}, async (err: any, decodedUser: { id: any; }) => {
            if (err) throw err;

            const user = await UserModel.findById(decodedUser.id).select("+email").exec();

            const userData = await UserDataModel.find({ owner: decodedUser.id }).exec();

            const userObject = {
                user,
                userData: userData[0],
            }

            res.status(200).json(userObject);
        })
    }
    else {
        res.json(null);
    }
};

interface LoginBody {
    email?: string,
    password?: string,
}

export const login: RequestHandler<unknown, unknown, LoginBody, unknown> = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        if (!email || !password) {
            throw createHttpError(400, "Parameters missing");
        }

        const user = await UserModel.findOne({ email: email }).select("+password +email").exec();

        if (!user) {
            throw createHttpError(401, "User not found");
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            throw createHttpError(401, "Invalid password");
        }

        jwt.sign({
            email: user.email,
            id: user._id
        }, env.JWT_SECRET, {}, async (err: any, token: any) => {
            if (err) throw err;

            const userData = await UserDataModel.find({ owner: user._id }).exec();

            const userObject = {
                user,
                userData: userData[0],
            }

            res.cookie('token', token).json(userObject);
        });
    } catch (error) {
        next(error);
    }
};

interface SignUpBody extends LoginBody {
    fullname?: string;
    username?: string,
}

export const signUp: RequestHandler<unknown, unknown, SignUpBody, unknown> = async (req, res, next) => {
    const fullname = req.body.fullname;
    const username = req.body.username;
    const email = req.body.email;
    const passwordRaw = req.body.password;

    try {
        if (!fullname || !email || !passwordRaw) {
            throw createHttpError(400, "Parameters missing");
        }

        const existingEmail = await UserModel.findOne({ email: email }).exec();

        if (existingEmail) {
            throw createHttpError(409, "A user with this email address already exists. Please log in instead.");
        }

        if (username) {
            const existingUsername = await UserModel.findOne({ username: username }).exec();
            if (existingUsername) {
                throw createHttpError(409, "Username already taken. Please choose a different one or log in instead.");
            }
        }

        const passwordHashed = await bcrypt.hash(passwordRaw, 10);

        const newUser = await UserModel.create({
            fullname: fullname,
            username: username,
            email: email,
            password: passwordHashed,
        });

        jwt.sign({
            email: newUser.email,
            id: newUser._id,
        }, env.JWT_SECRET, {}, async (err: any, token: any) => {
            if (err) throw err;
            const user = {
                id: newUser._id,
                email: newUser.email,
                fullname: newUser.fullname,
                username: newUser.username,
            }

            const userData = await UserDataModel.create({
                owner: newUser._id,
                photo: "",
                race: "",
                bio: "",
                base: "",
                origin: "",
            })

            const userObject = {
                user,
                userData,
            }

            res.cookie('token', token).json(userObject);
        });

    } catch (error) {
        next(error);
    }
};

export const logout: RequestHandler = (req, res, next) => {
    // req.session.destroy(error => {
    //     if (error) {
    //         next(error);
    //     } else {
    //         res.sendStatus(200);
    //     }
    // });
    res.cookie('token', '').json(true);
};




async function updateDatabase() {
    const site = "Martian Forces";

    const sectors = ["olympus mons", "jezero", "gale", "gusev", "meridiani",
        "olympus mons", "capri chasma", "coloe", "shalbatana", "valles marineris",
        "cavi angusti", "medusae fossae", "nicholson", "zunil", "milankovic",
        "terra sirenum", "eberswalde"]

    const species = ["asari", "drell", "elcor", "hanar", "human", "keeper",
        "salarian", "turian", "volus", "batarian", "collector", "geth",
        "krogan", "leviathan", "quarian", "reaper", "vorcha", "prothean", "rachni"]

    const planetary_bodies = {
        arvuna: {
            name: "Arvuna",
            description: `Arvuna, a moon of Dranen, is classified as a water
            world because oceans or ice cover 90% of its surface. Besides 
            prodigious sea life, Arvuna is home to a host of venomous 
            arthropodal pests in the tropical zone with metallic carapaces 
            similar to those found on Palaven to resist radiation coming 
            from Dranen's magnetosphere. There are several well-shielded 
            human colonies on Arvuna, although they are alienated from the 
            Council and politically insignificant to the Traverse and 
            Terminus Systems.The Reapers have yet to reach Arvuna, concentrating 
            instead on the Balor system. While this cuts Arvuna off from 
            the cluster's mass relay, it is at least some evidence that 
            the Reapers cannot be everywhere at once.`,
            image: "Arvuna.webp",
            orbital_distance: "2.5 AU",
            orbital_period: "4.0 Earth Years (Dranen) 66 days (Arvuna)",
            radius: "6,448 km",
            day_length: "29.2 Earth Hours",
            atm_pressure: "1.45 atm",
            surface_temp: "1 °C",
            surface_grav: "1.1 g",
            mass: "1.116 Earth Masses",
            satellites: "",
            species: "Human",
            population: "948,700",
        },
        neptune: {
            name: "Neptune",
            body: "planet",
            description: `Though Neptune, like Uranus, has plentiful helium, its remoteness 
            made it an unpromising target for mining before the development of mass effect drive. 
            With Uranus cheaper to exploit, it has never seen extensive development. 
            The only permanent human presence is a small research facility on Triton.`,
            image: "",
            orbital_distance: "29.1 AU",
            orbital_period: "164.8 Earth Years",
            radius: "24,764 km",
            day_length: "16.1 Earth Hours",
            atm_pressure: "",
            surface_temp: "",
            surface_grav: "",
            mass: "17 Earth Masses",
            satellites: "14",
            species: "Human",
            population: "70 triton",
        },
        lethe: {
            name: "Lethe",
            body: "moon",
            description: `Lethe is the largest moon of Mnemosyne, massive enough to retain its own 
            thin atmosphere of methane and nitrogen, and heated by the brown dwarf to relatively 
            moderate temperatures. While nearly the size of Earth, its overall density is low, 
            suggesting a paucity of valuable heavy metals. It is tidally locked to Mnemosyne, one 
            hemisphere always bathed in the brown dwarf's heat and dim red light.The moon experiences 
            constant weak tectonic activity, driven by the tidal fluxes of Mnemosyne's gravity rather 
            than Lethe's own internal heat. Several large, ancient volcanoes release wide-ranging 
            flows of molten silicate.`,
            image: "Lethe.webp",
            orbital_distance: "2,323,500 km (from Mnemosyne)",
            orbital_period: "16.4 Earth Days",
            radius: "5,663 km",
            day_length: "16.4 Earth Days",
            atm_pressure: "0.58 atm",
            surface_temp: "31 °C",
            surface_grav: "0.59 g",
            mass: "0.462 Earth Masses",
            satellites: "",
            species: "",
            population: "0",
        },
        luna: {
            name: "Luna",
            body: "moon",
            description: `An early source of helium-3, Luna is now mined for materials used in space 
            habitat construction. Two dozen major stations have been constructed at Earth's L4 and L5 
            Lagrange points, all from lunar resources.`,
            image: "Luna.webp",
            orbital_distance: "384,403 km",
            orbital_period: "27.3 Earth Days",
            radius: "1,737 km",
            day_length: "27.3 Earth Days",
            atm_pressure: "Trace",
            surface_temp: "-53 °C",
            surface_grav: "0.1654 g",
            mass: "0.012 Earth Masses",
            satellites: "",
            species: "Human",
            population: "4.1 million",
        },
        menae: {
            name: "Menae",
            body: "moon",
            description: `Palaven's largest moon has been shrouded in secrecy since the dawn of the 
            turian space age. During the Krogan Rebellions, the Hierarchy classified nearly all data 
            on Menae, and its sister moon Nanus, because they feared the krogan could use the moons 
            as weapons by smashing them into Palaven's surface. However, some information has leaked 
            out. Images of turian bases where personnel walk without enviro-suits indicate advanced 
            infrastructure--likely a network of subterranean tunnels with powerful mass effect field 
            generators that retain heat and atmosphere over swaths of the surface.`,
            image: "Menae.webp",
            orbital_distance: "classified",
            orbital_period: "33 Earth Days",
            radius: "Classfied",
            day_length: "Classified",
            atm_pressure: "Classified",
            surface_temp: "Classified",
            surface_grav: "Classified",
            mass: "",
            satellites: "",
            species: "",
            population: "",
        },
        palaven: {
            name: "Palaven",
            body: "planet",
            description: `"The only thing on this planet that isn't silver are the turians. It's all too 
            clear they're made of steel." These were Alliance hero Jon Grissom's impressions of the turian 
            homeworld Palaven, seen by humans for the first time following the First Contact War. The turians' 
            martial attitude permeates every aspect of Palaven society, from architecture to art to politics. 
            It's no surprise that their homeworld was never occupied by an invading force until now. 
            <br>
            The Reapers, aware of their enemy's reputation, brought overwhelming force to Palaven and did not 
            hesitate to bombard cities that resisted--and all of them resisted. The dust and smoke from 
            pulverized cities is now a breathing hazard across much of the planet. Water and power supplies 
            have all but vanished. Still, the fight here has cost the Reapers dearly. 
            <br>
            ALLIANCE TRAVEL ADVISORY: Palaven's weak magnetic field means solar radiation levels are greater than those found on other habitable worlds. Human visitors are advised to wear enviro-suits or other radiation protection when visiting Palaven.`,
            image: "Palaven.webp",
            orbital_distance: "1.15 AU",
            orbital_period: "1.2 Earth Years",
            radius: "8,990 km",
            day_length: "28.3 Earth Hours",
            atm_pressure: "1.1 atm",
            surface_temp: "31 °C",
            surface_grav: "1.14 g",
            mass: "2.248 Earth Masses",
            satellites: "Menae, Nanus",
            species: "Turian",
            population: "6.1 billion",
        },
        silva: {
            name: "Silva",
            body: "planet",
            description: `Named for Mateus Silva, leader of the prospector team that unearthed 
            the Prothean Archives on Mars, this ice giant was once home to a large recovery 
            operation for helium-3. In its heyday, the helium-3 flowed freely here to fuel merchant 
            ships commuting from Benning to Arcturus.
            <br>
            All infrastructure on Silva has been destroyed, along with the colony on Oliveira, its moon.`,
            image: "Silva.webp",
            orbital_distance: "4.1 AU",
            orbital_period: "6.8 Earth Years",
            radius: "31,096 km",
            day_length: "17.7 Earth Hours",
            atm_pressure: "",
            surface_temp: "",
            surface_grav: "",
            mass: "",
            satellites: "1",
            species: "",
            population: "",
        },
        oltan: {
            name: "Oltan",
            body: "moon",
            description: `The first mission to Oltan, Dekuuna's moon, was a century in the making. 
            Elcor leaders felt resources for space travel could be better used on their homeworld, 
            and it took decades of persuasion to secure project funding.
            <br>
            Archaic harvesting stations that recovered helium-3 from the moon's regolith were still 
            functioning when the Reapers invaded, and the elcor stationed there were able to flee the system.`,
            image: "Oltan.webp",
            orbital_distance: "625,369 km",
            orbital_period: "44.45 Earth Days",
            radius: "2,822 km",
            day_length: "44.45 Earth Days",
            atm_pressure: "",
            surface_temp: "-40 °C",
            surface_grav: "0.24g",
            mass: "0.047 Earth Masses",
            satellites: "",
            species: "",
            population: "",
        },
        presrop: {
            name: "Presrop",
            body: "moon",
            description: `Presrop is the moon of Klendagon. It is a frigid, barren world, with an 
            extremely thin atmosphere of carbon dioxide and ethane. The crust contains plentiful 
            deposits of heavy metals. The Alliance has opened bidding for the moon's mineral rights, 
            but exploitation will be complicated by the system's proximity to the "Five Kiloparsec Ring" 
            around the galactic core. The Ring is an area of intense star formation, and too dangerous to safely travel.
            <br>
            Presrop's landscape is a nightmare of jagged, overlapping ridges and geological shock 
            zones created by some ancient disaster. This has not deterred a generation of illegal 
            "wildcat miners" from attempting to exploit the moon's mineral riches. Unfortunately, 
            many have lost their lives.`,
            image: "Presrop.webp",
            orbital_distance: "168,500 km (from Klendagon)",
            orbital_period: "10.8 Earth Days",
            radius: "4,113 km",
            day_length: "10.8 Earth Days",
            atm_pressure: "0.1 atm",
            surface_temp: "-73 °C",
            surface_grav: "0.88g",
            mass: "0.363 Earth Masses",
            satellites: "",
            species: "",
            population: "",
        },
        sinmara: {
            name: "Sinmara",
            body: "moon",
            description: `Surtur's moon Sinmara has been used for many generations to monitor its 
            parent star Solveig. It has no atmosphere to interfere with solar observational equipment, 
            which is critical at this juncture; the star recently showed signs of erupting prematurely into a red giant.
            <br>
            In preparation for the day when the critical warning goes out, the extranet channel 
            from Sinmara's research station is given top priority throughout the comm buoys in the system. 
            The chances of such a signal being received over the sun's magnetic interference at that 
            time is low, but relegating it to a lower channel proved politically untenable.`,
            image: "Sinmara.webp",
            orbital_distance: "",
            orbital_period: "",
            radius: "",
            day_length: "",
            atm_pressure: "",
            surface_temp: "",
            surface_grav: "",
            mass: "",
            satellites: "",
            species: "",
            population: "135",
        },
        suntur: {
            name: "Suntur",
            body: "planet",
            description: `Surtur is a small but dense desert planet close to its parent star. All but 
            traces of its nitrogen-carbon monoxide atmosphere have burned away, leaving it cooler than 
            similar planets in other systems. Robo-mining has proved lucrative, as it has developed 
            significant deposits of beryllium and palladium.`,
            image: "Suntur.webp",
            orbital_distance: "0.7 AU",
            orbital_period: "0.6 Earth Years",
            radius: "4,433 km",
            day_length: "4,433 km",
            atm_pressure: "4,433 km",
            surface_temp: "126 °C",
            surface_grav: "0.8 g",
            mass: "0.384 Earth Masses",
            satellites: "",
            species: "",
            population: "",
        },
        solcrum: {
            name: "Solcrum",
            body: "moon",
            description: `WARNING: Level 1 Heat Hazard
            <br>
            Solcrum is the largest moon of the gas giant Notanban. It has a trace atmosphere of krypton and xenon. 
            The crust is composed of various metals with deposits of sodium. As with every body in the solar system, 
            the surface is scorching hot and thoroughly irradiated by the blue giant Grissom. 
            Surface excursions without proper protective gear are certain to prove fatal.
            <br>
            On approach to Notanban, Normandy's passive sensor array intercepted a fragmentary coded transmission 
            from the surface of Solcrum. Attempts to decrypt the message were fruitless; 
            it does not appear to be in any software coding language used by the Citadel races.`,
            image: "Solcrum.webp",
            orbital_distance: "10,367,883 km",
            orbital_period: "0.6 Earth Years",
            radius: "4,534 km",
            day_length: "0.6 Earth Years",
            atm_pressure: "0.00 atm",
            surface_temp: "351 °C",
            surface_grav: "0.8 g",
            mass: "0.401 Earth Masses",
            satellites: "",
            species: "",
            population: "",
        },
        saturn: {
            name: "Saturn",
            body: "planet",
            description: `Saturn has been a major source of helium-3 fuel for fusion plants since the 2150s. 
            The moon of Titan is mined for hydrocarbons, and used as a hostile environment training facility 
            for Alliance Marines.`,
            image: "Saturn.webp",
            orbital_distance: "9.5 AU",
            orbital_period: "29.5 Earth Years",
            radius: "60,268 km",
            day_length: "10.3 Earth Hours",
            atm_pressure: "",
            surface_temp: "",
            surface_grav: "",
            mass: "95 Earth Masses",
            satellites: "60",
            species: "Human",
            population: "117,000 (orbitals and Titan)",
        },
        franklin: {
            name: "Franklin",
            body: "moon",
            description: `A large moon, Franklin retains a trace atmosphere of carbon dioxide, 
            but its desolate surface holds no signs of water or life. In order to defend Watson from 
            the pirates of the Terminus Systems, Franklin is home to two Alliance spaceports and naval 
            bases capable of fielding six fighter squadrons each and a classified number of interplanetary 
            ballistic missiles. Mass effect fields keep the gravity in its installations at a comfortable 
            level for long-term living.`,
            image: "Saturn.webp",
            orbital_distance: "",
            orbital_period: "",
            radius: "2,405 km",
            day_length: "33 Earth Days",
            atm_pressure: "Trace",
            surface_temp: "-116 °C",
            surface_grav: "0.1 g",
            mass: "0.014 Earth Masses",
            satellites: "",
            species: "Human",
            population: "",
        },
        kopis: {
            name: "Kopis",
            body: "moon",
            description: `Makhaira's largest moon, Kopis, is a desolate place with an extremely 
            thin atmosphere. Its crust is largely silica-based, and there are no signs of water. 
            Like its parent planet, its high albedo keeps it from being a total inferno, and when 
            occluded by Makhaira, its temperatures can be nearly tolerable. Its low gravity can 
            easily be countered by a vehicular or personal mass effect field for comfortable exploration.`,
            image: "Kopis.webp",
            orbital_distance: "0.55 km",
            orbital_period: "",
            radius: "1,733 km",
            day_length: "21.3 Earth Days",
            atm_pressure: "Trace",
            surface_temp: "51 °C",
            surface_grav: "0.1 g",
            mass: "0.007 Earth Masses",
            satellites: "",
            species: "",
            population: "",
        },
        jupiter: {
            name: "Jupiter",
            body: "planet",
            description: `Jupiter's deep gravity well and lethal radiation have kept its moons from 
            being significantly exploited. The largest outpost is Binary Helix Corporation's Nautilus facility, 
            attached to the underside of Europa's ice sheet.`,
            image: "Jupiter.webp",
            orbital_distance: "5.2 AU",
            orbital_period: "11.7 Earth Years",
            radius: "71,492 km",
            day_length: "9.93 Earth Hours",
            atm_pressure: "",
            surface_temp: "",
            surface_grav: "",
            mass: "318 Earth Masses",
            satellites: "63",
            species: "Human",
            population: "9,100 (all moons)",
        },
        verush: {
            name: "Verush",
            body: "planet",
            description: `Verush is a hydrogen-helium gas giant named for an ancient batarian monarch 
            whose empire spanned continents. He had such a penchant for mating that 0.6 percent of modern 
            batarians claim to trace their lineage to him.
            <br>
            The planet's moons are named after his many recognized wives. The largest, Bira, concealed 
            Prothean ruins that helped the batarians develop FTL travel. It is a batarian point 
            of pride that, since the ruins were damaged by earthquakes, 
            they had less information to go on than other spacefaring species.
            <br>
            The Reapers have destroyed all obvious military outposts in Verush's orbit. 
            The batarians' notorious secrecy, however, may have allowed concealed subterranean 
            facilities on Verush's moons to survive.`,
            image: "Jupiter.webp",
            orbital_distance: "5.4 AU",
            orbital_period: "12.6 Earth Years",
            radius: "53,150 km",
            day_length: "11.4 Earth Hours",
            atm_pressure: "",
            surface_temp: "",
            surface_grav: "",
            mass: "",
            satellites: ">1",
            species: "",
            population: "",
        },
        elysium: {
            name: "Elysium",
            body: "planet",
            description: `When searching for a colony to retire to, Alliance hero Jon Grissom said 
            he wanted "the one where the sun has the decency to set at a reasonable time." 
            Elysium fulfilled this criteria and many more, featuring low gravity, tolerable atmospheric pressure, 
            and a suitable climate. Humans and aliens alike flocked to the "alpine paradise" early 
            in its colonial years, and the planet remains a vibrant hub for both visitors and permanent residents.
            <br>
            Security is a constant concern for Elysium; the planet has suffered several pirate 
            or mercenary attacks, including the Skyllian Blitz of 2176. Elysium's airspace is secured 
            by mobile planetary defense cannons--its armed starship complement is relatively light. 
            Materiel and volunteers from Elysium formed part of the Alliance Second Fleet, 
            which was stationed near Arcturus before the fleet was destroyed by the Reapers.`,
            image: "elysium.webp",
            orbital_distance: "1.3 AU",
            orbital_period: "1.5 Earth Years",
            radius: "5,723 km",
            day_length: "27.9 Earth Hours",
            atm_pressure: "1.3 atm",
            surface_temp: "8 °C",
            surface_grav: "0.695 g",
            mass: "0.555 Earth Masses",
            satellites: "",
            species: "Human",
            population: "8.3 million",
        },
        cernunnos: {
            name: "Cernunnos",
            body: "planet",
            description: `Cernunnos is a sizable gas giant with high nitrogen content. 
            It is believed to be an extrasolar capture due to its close stellar location. 
            In a rare phenomenon, it is near enough to its red dwarf star to be within the life zone, 
            although its massive size prevents the tidal lock that usually occurs at this range.
            <br>
            While nothing could survive on the surface of a planet with such crushing gravity, 
            Cernunnos' moon, Caleston, has life. Cernunnos was skimmed for its abundant hydrogen, 
            and refineries on Caleston processed it into a metastable metallic form for use 
            as starship fuel. The Reapers have since destroyed this operation.`,
            image: "Cernunnos.webp",
            orbital_distance: "0.07 AU",
            orbital_period: "31 Earth Days",
            radius: "49,231 km",
            day_length: "17 Earth Hours",
            atm_pressure: "0.86 atm",
            surface_temp: "",
            surface_grav: "",
            mass: "",
            satellites: ">1",
            species: "",
            population: "",
        },
        caleston: {
            name: "Caleston",
            body: "planet",
            description: `Caleston is the largest satellite of the gas giant Cernunnos. 
            Ancient asteroid strikes deposited major lodes of element zero within the molten sulfur mantle. 
            Eldfell-Ashland Energy's mining operations made it the largest source of starship drive core 
            material in the Attican Traverse, which threatened Caleston's native biodiversity with industrial waste.
            <br>
            Caleston is wracked with volcanism due to tidal stresses from Cernunnos. 
            Because of weak solar output, plant-like life on Caleston is not carbon-based 
            and photosynthetic, but silicon-based and thermosynthetic, requiring heat rather than 
            sunlight to power chemical reactions. These organisms flourish in volcanic vents 
            and during solar flares, when Balor, Caleson's [sic] sun, can double or triple in luminosity. 
            Oxygen-breathing habitation is not possible outside its many domed cities. 
            Those cities are now feasts for the Reapers, who drove off Caleston's protective 
            fleet and now threaten to puncture domes to force the population into submission.`,
            image: "Caleston.webp",
            orbital_distance: "0.07 AU",
            orbital_period: "21.5 Earth Hours (around Cerunnos)",
            radius: "6,600 km",
            day_length: "21.5 Earth Hours",
            atm_pressure: "0.9 atm",
            surface_temp: "30 °C",
            surface_grav: "1.2 g",
            mass: "1.275 Earth Masses",
            satellites: "",
            species: "",
            population: "1.8 million",
        },
        asteria: {
            name: "Asteria",
            body: "planet",
            description: `A habitable planet known for its arid sulfurous deserts, Asteria is 
            colonized near the poles to avoid the uncomfortable temperatures that can reach 
            65 degrees Celsius in more southern latitudes. While the seas contain primitive animal life, 
            little of it can live on land, leaving the soil to hardy plants that can survive 
            in the extreme heat. Asteria is home to thriving human and asari agrarian colonies 
            but little in the way of manufacturing or mining.
            <br>
            TRAVEL ADVISORY: Carbon dioxide concentrations can reach 2,500 parts per million 
            in Asteria's atmosphere. Citizens should carry supplemental oxygen for children and 
            the elderly. Consult with local governments to discuss animal companion detection 
            systems or other preparatory measures.
            <br>
            ALLIANCE BULLETIN: Geth have been encountered in the Hekate system. All civilian traffic is prohibited.`,
            image: "Asteria.webp",
            orbital_distance: "1.3 AU",
            orbital_period: "1.5 Earth Years",
            radius: "5,900 km",
            day_length: "21.4 Earth Hours",
            atm_pressure: "1.2 atm",
            surface_temp: "25 °C (habitable zone)",
            surface_grav: "0.8 g",
            mass: "0.679 Earth Masses",
            satellites: "",
            species: "Asari",
            population: "188 million",
        },
        chasca: {
            name: "Chasca",
            body: "planet",
            description: `Chasca is a large but low density world, fundamentally similar to 
            its inner neighbor Inti. Like Inti, Chasca is tidally-locked to Matano. 
            The same side always faces the sun, resulting in a scorching day side and a 
            frozen night side. In the temperate areas around the terminator, temperatures 
            average around 30 Celcius. Combined with a nitrogen-oxygen atmosphere, this slender 
            band of habitable terrain allows limited colonization by humans.
            <br>
            Chasca's ring is unique. It appears to be, for lack of a better term, a massive piece 
            of alien "installation art." The rings are made of small pieces of synthetic material, 
            and are almost invisible from space. From the ground, they catch and scatter the 
            light of Matano in picturesque ways. It is not known who created the ring, or when.
            <br>
            Chasca is very early in development, with little more than a few pioneer teams 
            scattered across the surface. Information is being collated about native hazards 
            and ecology, while a massive colonist recruiting drive is gearing up back on Earth.`,
            image: "Chasca.webp",
            orbital_distance: "",
            orbital_period: "1.3 Earth Years",
            radius: "8,059 km",
            day_length: "1.3 Earth Years",
            atm_pressure: "0.86 atm",
            surface_temp: "67 °C",
            surface_grav: "0.88 g",
            mass: "1.395 Earth Masses",
            satellites: "",
            species: "Human",
            population: "150",
        },
        altakiril: {
            name: "Altakiril",
            body: "planet",
            description: `Altakiril is a garden world on the outer edge of its star's habitable zone. 
            The planet is largely frozen, yet it features native dextro-amino-acid-based life in 
            its lower latitudes. These species evolved to withstand periodic freezing and compensate 
            for the cold with spectacular population explosions during the long, mild summers.
            <br>
            Hardy, independent-minded turians colonized the planet. The quarians briefly considered 
            contesting them but were daunted by the virulence of the planet's infectious life during 
            the growing season, not to mention the colonists who had ties to warlords elsewhere 
            in the Shrike Abyssal.`,
            image: "Altakiril.webp",
            orbital_distance: "1.6 AU",
            orbital_period: "2.3 Earth Years",
            radius: "4,145 km",
            day_length: "19.2 Earth Hours",
            atm_pressure: "1.19 atm",
            surface_temp: "-24 °C",
            surface_grav: "",
            mass: "",
            satellites: "",
            species: "Turian",
            population: "13.5 million",
        },
        anhur: {
            name: "Anhur",
            body: "planet",
            description: `A garden world with heavy populations of humans and batarians, 
            Anhur was home to one of the ugliest violations of sapient rights in modern 
            human history. A consortium of corporations and corrupt politicians, fearing 
            batarian economic competition due to their custom of legal slavery, passed a 
            resolution that abolished the minimum wage -- effectively relegalizing 
            slavery on a human-dominated world.
            <br>
            Opponents of the motion quickly turned to activism and violence. 
            A civil war erupted, as one side sought to end slavery throughout 
            the system and another, primarily batarian faction called the Na'hesit 
            sought to keep the slaves they had. The Anhur Rebellions raged from 2176 to 2178. 
            The Na'hesit had a significant advantage in ships, labor, and weapons, 
            forcing the Anhur militias to hire mercenary companies to even the odds. 
            In the end, the abolitionists won out, though at the cost of much of 
            their infrastructure. Though Anhur today still has significant natural wealth, 
            it is economically depressed, save for the reconstruction industry.`,
            image: "Altakiril.webp",
            orbital_distance: "1.7 AU",
            orbital_period: "2.2 Earth Years",
            radius: "6,829 km",
            day_length: "18.0 Earth Hours",
            atm_pressure: "0.6 atm",
            surface_temp: "7 °C",
            surface_grav: "1.3 g",
            mass: "1.479 Earth Masses",
            satellites: "",
            species: "",
            population: "208 million",
        },
        benning: {
            name: "Benning",
            body: "planet",
            description: `Benning, the nearest garden world to Arcturus Station, 
            is the primary source of its food supply and an important staging area 
            for starship maintenance and repair. Occupying the planet would be key 
            in any attempt to retake the system's relay.
            <br>
            Scattered intelligence indicates that during the battles of Arcturus 
            and Earth, the Reapers sent a small force to Benning to destroy 
            its comm buoys, spaceports, and starships. With the population 
            immobilized and communications cut, the main force concentrated on 
            the larger prize, knowing they could return before repairs could be 
            made or help could arrive.
            <br>
            Heat sources in Benning's space indicate a non-Reaper presence here.`,
            image: "Benning.webp",
            orbital_distance: "1.1 AU",
            orbital_period: "0.9 Earth Years",
            radius: "9,362 km",
            day_length: "",
            atm_pressure: "1.13 atm",
            surface_temp: "63 °C",
            surface_grav: "1.14 g",
            mass: "2.438 Earth Masses",
            satellites: "",
            species: "Human",
            population: "2.25 million",
        },
        aratoht: {
            name: "Aratoht",
            body: "planet",
            description: `"Like Mount Everest inside an oven," was how Jon Grissom 
            described Aratoht while on a fact-finding mission to see if the garden 
            world was worth contestation with the batarians. His team ultimately 
            decided that the planet's air pressure and oxygen content were too low 
            for large-scale human habitation. Undeterred, the Batarian Hegemony 
            colonized the planet's polar regions and began an extensive terraforming 
            effort with cyanobacteria and invasive plant species. 
            Alliance intelligence has confirmed that the colony has several batarian 
            military installations, which are too close to human space for the Alliance's comfort.
            <br>
            EDI'S TRAVEL ADVISORY: The Batarian Hegemony considers any presence 
            of Alliance military vessels in batarian space as hostile. 
            The Normandy SR2, while an independent vessel, strongly resembles 
            the Normandy SR1, an Alliance ship. Use of stealth systems is highly recommended.`,
            image: "Aratoht.webp",
            orbital_distance: "1.15 AU",
            orbital_period: "1.2 Earth Years",
            radius: "4,757 km",
            day_length: "20.0 Earth Hours",
            atm_pressure: "0.57 atm",
            surface_temp: "55 °C",
            surface_grav: "0.71 g",
            mass: "0.392 Earth Masses",
            satellites: "1",
            species: "Batarian",
            population: "Estimated 90,000 (free), 215,000 (other)",
        },
        bekenstein: {
            name: "Bekenstein",
            body: "planet",
            description: `The recipient of the first wave of Earth's colonization efforts, 
            Bekenstein's founders had a decidedly less agrarian plan than Eden Prime. 
            The mission of Bekenstein's first colony was to become Earth's off-planet 
            manufacturing base, ingratiating humanity into galactic culture by 
            producing needed goods. Meeting with mixed success for the first generation, 
            Bekenstein then leapfrogged its competition by producing high-quality 
            luxury goods that went straight to nearby markets via the Citadel. 
            Today, Bekenstein is known as "the humans' Illium," a place where 
            new-money tycoons flaunt their wealth and the have-nots are rarely spoken of.`,
            image: "Bekenstein.webp",
            orbital_distance: "1.8 AU",
            orbital_period: "2.4 Earth Years",
            radius: "6,050 km",
            day_length: "21.3 Earth Hours",
            atm_pressure: "1.17 atm",
            surface_temp: "43 °C (mean) 25 °C (habitable zone)",
            surface_grav: "0.9 g",
            mass: "0.804 Earth Masses",
            satellites: "",
            species: "Human",
            population: "5.425 million",
        },
        erszbat: {
            name: "Erszbat",
            body: "planet",
            description: `Erszbat was a wealthy batarian colony, rich in farmland, minerals and manufacturing infrastructure. Little recent information about it has escaped this section of space--but radio traffic from the planet paints a dire picture.

            Indoctrinated batarian officials are offering rewards for every living body brought to the labor camps, slave or not. With the state apparatus at their disposal, Reaper units are coordinating house-to-house hunts for resistance members, and paying those who turn them in. Government propaganda dismisses the smell of the processing ships as a natural byproduct of Reaper energy consumption. Columns of dust from annihilated cities tell the story of those who disobeyed.`,
            image: "Erszbat.webp",
            orbital_distance: "0.9 AU",
            orbital_period: "1 Earth Year",
            radius: "4,187 km",
            day_length: "59 Earth Hours",
            atm_pressure: "1.37 atm",
            surface_temp: "41 °C",
            surface_grav: "0.76 g",
            mass: "0.325 Earth Masses",
            satellites: "",
            species: "Batarian",
            population: "",
        },
        adek: {
            name: "Adek",
            body: "planet",
            description: `Adek is a brutally hot and wet garden world, covered with molds and 
            lichen analogues. It has many viruses and bacteria lethal to batarian physiology. 
            The Hegemony colonized Adek early in its expansion, but few of the colonists 
            wanted to stay. The result was domination by a class of landed slave-owners. 
            A small cadre of well-paid engineers and skilled laborers kept the planet's 
            mechs and infrastructure functioning.
            <br>
            Alliance estimates put the planet's batarian population at just over six million, 
            but that number has likely fallen since the Reapers arrived.`,
            image: "Adek.webp",
            orbital_distance: "4.5 AU",
            orbital_period: "7.3 Earth Year",
            radius: "5,075 km",
            day_length: "58 Earth Hours",
            atm_pressure: "0.45 atm",
            surface_temp: "60 °C",
            surface_grav: "0.78 g",
            mass: "0.49 Earth Masses",
            satellites: "",
            species: "Batarian",
            population: "",
        },
        horizon: {
            name: "Horizon",
            body: "planet",
            description: `A temperate world that has hit the "sweet spot" for carbon-based life, 
            Horizon has a nitrogen-oxygen atmosphere maintained by abundant plants and bacteria. 
            Its soil is particularly compatible with Earth vegetation, 
            and so a thriving human community has sprung up.
            <br>
            Horizon's population is in flux. A Collector attack in 2185 inflicted 
            significant casualties, but refugees have been streaming to the planet 
            since the Reaper invasion began. Since many land illegally, 
            there is no way to accurately track population. Although many colonists 
            resent the newcomers, others have embraced Horizon's new role. 
            Advertisements for "Sanctuary," its main refugee center, can be seen galaxy-wide.`,
            image: "Horizon.webp",
            orbital_distance: "2.1 AU",
            orbital_period: "3.0 Earth Years",
            radius: "5,402 km",
            day_length: "37.8 Earth Hours",
            atm_pressure: "1.68 atm",
            surface_temp: "13 °C",
            surface_grav: "0.7 g",
            mass: "0.498 Earth Masses",
            satellites: "",
            species: "Human",
            population: "654,390 (2185) Unknown, est. 800,000 - 1.5 million (2186)",
        },
        kharshan: {
            name: "Kharshan",
            body: "planet",
            description: `Khar'shan, the batarian homeworld, is wrapped less in mystery 
            than in outright lies. Batarian propaganda claims the world has 15 billion 
            inhabitants and an economy that rivals the asari. Although the legal slave 
            trade does boost the batarians' profits somewhat, Citadel sanctions have 
            left a paper tiger of an empire, one that fights rivals through deniable 
            terrorist actions rather than the wars of its heyday centuries ago.
            <br>
            The Reapers will likely be the death blow to that empire. Almost no 
            information has escaped Khar'shan since the Reapers destroyed the comm buoys, 
            but batarian refugees say that resistance has created a bond among the commoners. 
            If a new government can rise from the ashes, that bond may sustain a 
            new batarian society.`,
            image: "Kharshan.webp",
            orbital_distance: "1.45 AU",
            orbital_period: "1.7 Earth Years",
            radius: "5,222 km",
            day_length: "18.5 Earth Hours",
            atm_pressure: "0.62 atm",
            surface_temp: "33 °C",
            surface_grav: "0.96 g",
            mass: "0.639 Earth Masses",
            satellites: "",
            species: "Batarian",
            population: "",
        },
        eletania: {
            name: "Eletania",
            body: "planet",
            description: `Eletania appears to be a world eminently suited for colonization. 
            Sadly, appearances are deceiving. It is covered by a verdant carpet of mosses, 
            algae, and lichen, and possesses a thick oxygenated atmosphere, 
            but the animal kingdom is a web of microscopic symbiotic creatures. 
            These are impossible to filter from the air and necessary for 
            the native life to thrive. Unfortunately, they also cause anaphylactic 
            shock when inhaled by non-native life.
            <br>
            In short, settlement requires either fully sealed environment suits, 
            or replacement of the entire world’s ecosystem. Some have proposed 
            limited colonization at altitudes above the symbiotes' range, or in areas 
            where favorable winds keep the air clear.`,
            image: "Eletania.webp",
            orbital_distance: "12.6 AU",
            orbital_period: "34.4 Earth Years",
            radius: "8,864 km",
            day_length: "35.6 Earth Hours",
            atm_pressure: "2.1 atm",
            surface_temp: "13 °C",
            surface_grav: "1.2 g",
            mass: "2.301 Earth Masses",
            satellites: "1",
            species: "",
            population: "",
        }
    }

    const data = await DataModel.create({
        site,
        sectors,
        species,
        planetary_bodies,
    });

    return data;
}