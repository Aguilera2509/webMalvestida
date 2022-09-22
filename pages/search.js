import Head from 'next/head'
import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
import { FormSearch } from './formSearch';
import { LinksPages } from './links';
import { Loader } from './loader';

let page = 10

export default function searchData(){
  const [scrollY, setScrollY] = useState(0) //Variable get move scroll
  const [outerY, setOuterY] = useState(1) //Variable get size windown only Y.
  const [loader, setLoader] = useState(false)
  const [webMalvestidas, setWebMalvestidas] = useState([]) //all posts data
  const [valueSearch, setValueSearch] = useState(null) //Variable get value input for search that specific info
  const [dataExists, setDataExists] = useState(true) //Determine if value of valueSearch exists 
  const [endData, setEndData] = useState(false) //Determine when leave load data
  const [catchErr, setCatchErr] = useState(false) //If there is issues with FETCH

  async function postsMalvestidas(){
    try{
      const res = await fetch(`https://malvestida.com/wp-json/wp/v2/search?_embed&search=${valueSearch}&lang=en&per_page=${page}`);
      const data = await res.json()
      if(data.length === 0){
        setLoader(false)
        return setDataExists(false)
      }
      if(data.length < page){
        setEndData(true)
      }
      setWebMalvestidas(data)
    } catch(err){
      setCatchErr(true)
    } finally{
      setLoader(false)
    }
  }
  //USEEFFECT pending of change in ValueSearch
  useEffect(()=>{
    if(valueSearch === null) return
    setLoader(true)
    page = 10 //restart page when search again
    postsMalvestidas()
    //Handle infinite scroll
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setOuterY(document.body.offsetHeight-window.innerHeight)
    }
    
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  },[valueSearch])
  //USEEFFECT pending of change in page for infinte scroll
  useEffect(()=>{
    if(page === 10) return
    postsMalvestidas()
  }, [page])
  //Detect when scroll is completely down for load more data
  if(scrollY === outerY && !endData && !loader){
    setLoader(true)
    setScrollY(0)
    //console.log("Hello W0rld")
    page = page + 5 //How many new data get 
  }

    return(
        <div className={styles.container}>
        <Head>
          <title>Malvestidas's Notices</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-iYQeCzEYFbKjA/T2uDLTpkwGzCiq6soy8tYaI1GyVh/UjpbCx/TYkiZhlZB6+fzT" crossOrigin="anonymous"></link>
        </Head>
  
        <main className={styles.main}>
          <h1 className={styles.title}>
            Welcome to <a href="https://malvestida.com/" target="_blank">Malvestidas's notices</a>
          </h1>
  
          {!loader &&
            <LinksPages />
          }

          <FormSearch setValueSearch={setValueSearch} setWebMalvestidas={setWebMalvestidas} setDataExists={setDataExists} />
  
          {catchErr &&
            <h5>Error with request, try later</h5>
          }

          <div>
            {!dataExists &&
              <p style={{color:"red", textAlign: "center"}}>Response to {valueSearch} Not Found</p>
            }

            {webMalvestidas.map(malvestida => {
              return(
                <div className='d-flex justify-content-center' key={malvestida.id}>
                <div className={styles.card}>
                  <img src={malvestida._embedded.self[0].jetpack_featured_media_url} className="card-img-top" alt={malvestida.title} />
                  <div className="card-body">
                    <h5 className="card-title">{malvestida.title}</h5>
                    <br />
                    <p className="card-text">{malvestida._embedded.self[0].yoast_head_json.description}</p>
                    <hr />
                    <p className="card-text">Articulo relizado por: <strong>{malvestida._embedded.self[0].yoast_head_json.author}</strong> el {malvestida._embedded.self[0].date.substring(0,10)}</p>
                  </div>
                  <br />
                  <details>
                    <summary>Ver contenido de la publicacion</summary>
                    <br/>
                    <a href={malvestida.url} target="_blank" className={styles.oficialPage}>Leer en la pagina oficial</a>
                  </details>
                </div>
                </div>
              )
            })}
          </div>
          {loader && <Loader />}
        </main>
      </div>
    )
}