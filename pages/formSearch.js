import { useState } from "react"

export const FormSearch = ({ setValueSearch, setWebMalvestidas, setDataExists }) => {

    const [something, setSomething] = useState("")

    function handleSubmit(e){
        e.preventDefault()
        setWebMalvestidas([]) //restart variable webMalvestidas when search again
        setDataExists(true) 
        setValueSearch(something) //Change value of valueSearch for search posts
    }

    return(
        <>
        <br />
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <input type="search" required className="form-control" value={something} onChange={(e) => setSomething(e.target.value)} id="exampleFormControlInput1" placeholder="Es bueno comer mucha fruta?" />
            </div>
            <input type="submit" value="Search" className="btn btn-outline-success" />
        </form>
        </>
    )
}