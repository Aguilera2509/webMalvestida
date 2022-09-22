import Link from "next/link"
import { useRouter } from "next/router"

export const LinksPages = () =>{
  const router = useRouter()
  let styleBtn = "btn btn-outline-dark"
  let styleBtnActive = "btn btn-outline-dark active"

  return(
    <div className="btn-group btn-group-lg" role="group" aria-label="Large button group">
      <Link href="/">
        <a className={router.asPath === "/" ? styleBtnActive : styleBtn}>Home</a>
      </Link>
      <Link href="/search">
        <a className={router.asPath === "/search" ? styleBtnActive : styleBtn}>Search</a>
      </Link>
    </div>
  )
}