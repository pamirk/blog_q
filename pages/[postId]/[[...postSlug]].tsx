import type {NextPage} from 'next'
import Article from "../../components/pages/Article/Article";
import {useRouter} from "next/router";


const Home: NextPage = () => {
    const router = useRouter()
    const {postSlug} = router.query
    router.query.postSlug = postSlug && postSlug[0]

    return <Article/>
}

export default Home



