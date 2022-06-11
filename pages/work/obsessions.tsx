import type {NextPage} from 'next'
import Obsessions from "../../components/pages/Obsessions/Obsessions";
import {useRouter} from "next/router";


const Home: NextPage = () => {
    const router = useRouter()
    router.query.edition = 'work'

    return (
        <Obsessions/>
    )
}

export default Home


