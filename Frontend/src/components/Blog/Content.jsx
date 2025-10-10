import "./style.css";


const Paragraph = ({ data }) => (
  <p dangerouslySetInnerHTML={{ __html: data.text }} />
);

const Quote = ({ data }) => (<div className="quote mt-3">
  <span dangerouslySetInnerHTML={{ __html: data.text }} className="text"/> <br />

    <span dangerouslySetInnerHTML={{ __html: data.caption }} className="caption"/>
  </div>
);

const Header = ({ data }) => {
    if(data.level === 2) return <h2  dangerouslySetInnerHTML={{ __html: data.text }} className="fs-4 mt-5"/>
    else return <h3  dangerouslySetInnerHTML={{ __html: data.text }} className="fs-5 mt-4"/>
}

const List = ({ data }) => {
    if(data.style === "unordered") return <ul>
        {data.items.map((item, idx) =>(<li dangerouslySetInnerHTML={{ __html: item }} key={idx}/>))}
    </ul>
    else if (data.style === "ordered") {
        return <ol>
        {data.items.map((item, idx) =>(<li dangerouslySetInnerHTML={{ __html: item }} key={idx}/>))}
    </ol>
    } else {
    return null; // fallback
  }
}

const Image = ({ data }) => (
  <figure className="content-image-container">
    <img
      src={data.file.url}
      alt={data.caption || "image"}
      className="content-image ratio ratio-16x9 mx-auto"
    />
    {data.caption && <figcaption>{data.caption}</figcaption>}
  </figure>
);


function Content({data, type}) {
    if(type === "paragraph") return <Paragraph data={data}/>
    else if(type === "quote") return <Quote data={data}/>
    else if(type === "header") return <Header data={data}/>
    else if(type === "list") return <List data ={data}/>
    else if(type === "image") return <Image data={data} />
    else return <>content</>
}


export default Content;