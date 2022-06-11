import type {NextPage} from 'next'
import Latest from "../../../components/pages/Latest/Latest";
import {useRouter} from "next/router";


const Home: NextPage = () => {
    const router = useRouter()
    router.query.edition = 'work'
    const {isEmailFeed} = router.query
    router.query.isEmailFeed = isEmailFeed && 'emails'

    return (
        <Latest/>
    )
}

export default Home


