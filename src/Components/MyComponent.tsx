import { Suspense } from "react";
import * as PouchDB from "pouchdb";

function MyComponent() {
    
}

//   const docs = useFind({
//     selector: {
//       name: { $gte: null }
//     },
//     sort: ["name"]
//   });
//   const db = useDB();

//   return (
//     <ul>
//       {docs.map(doc => (
//         <li key={doc._id}>
//           {doc.name}
//           <button onClick={() => db.remove(doc)}>Remove</button>
//         </li>
//       ))}
//     </ul>
//   );
// <PouchDB name="dbname">
//   <Suspense fallback="loading...">
//     <MyComponent />
//   </Suspense>
// </PouchDB>;