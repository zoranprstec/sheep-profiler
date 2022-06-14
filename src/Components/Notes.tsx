export default function Notes() {
    const backendData = [
        { title: "Grocery List", description: "Milk, Soup, Bread", createdat: "01-18-2021" },
        { title: "Math Homework", description: "Remember to finish question 8-10 before monday", createdat: "12-01-2020" },
        { title: "Call James", description: "Ask him about the company party.", createdat: "12-30-2020" }
      ]
    
      const noteRootStyle = {
        border: "2px #0af solid",
        borderRadius: 9,
        margin: 20,
        // backgroundColor: "#efefef",
        padding: 6
      };
    
      return (
        <div style={{ width: 400 }}>
          {backendData.map(ele => 
            <div style={noteRootStyle}>
              <h3>{ele.title}</h3>
              <p>{ele.description}</p>
              <small>{ele.createdat}</small>
            </div>
          )}
        </div>
      )
}