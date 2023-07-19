import { Link, Navigate, useParams } from "react-router-dom";
import DrellBlog from "./blogs/DrellBlog";
import HumanBlog from "./blogs/HumanBlog";
import JusticarBlog from "./blogs/JusticarBlog";
import SalarianBlog from "./blogs/SalarianBlog";
import TurianBlog from "./blogs/TurianBlog";

const BlogPage = () => {

    const { title } = useParams();

    if (!title) {
        return (
            <div className="w-full px-16">
                <h2 className="text-3xl py-10">Blogs</h2>
                <div className="flex flex-col gap-5 underline">
                    <div><Link to={'drell'}>Drell</Link></div>
                    <div><Link to={'human'}>Human</Link></div>
                    <div><Link to={'justicar'}>Justicar</Link></div>
                    <div><Link to={'salarian'}>Salarian</Link></div>
                    <div><Link to={'turian'}>Turian</Link></div>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="background-image-fixed" />
            <div id="home-page" className="h-full">
                <div id="content">
                    <div className="grid grid-cols-7 w-full">
                        <div id="blog" className="font-rubik">
                            {title == "drell" ? <DrellBlog /> :
                                title == "human" ? <HumanBlog /> :
                                    title == "justicar" ? <JusticarBlog /> :
                                        title == "salarian" ? <SalarianBlog /> :
                                            title == "turian" ? <TurianBlog /> :
                                                <Navigate to={'/notfound'} />}
                        </div>
                        <div id="side-content">

                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default BlogPage;