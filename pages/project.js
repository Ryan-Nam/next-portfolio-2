import ProjectItem from "@/components/projects/projectItem";
import { TOKEN, DATABASE_ID } from "../config";
import Layout from "@/components/home/layout";
import Head from "next/head";

// posts will be populated at build time by getStaticProps()
export default function project({ projects }) {
  console.log(projects);

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen px-3 mb-10">
        <Head>
          <title>Ryan's Portfolio</title>
          <meta name="description" content="Welcome to Ryan portfolio" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <h1 className="text-4xl font-bold sm:text-6xl">
          Total Projects :
          <span className="pl-4 text-blue-500">{projects.results.length}</span>
        </h1>

        <div className="grid grid-cols-1 gap-8 p-12 m-4 md:grid-cols-2">
          {projects.results.map((aProject) => (
            // <h1>{aProject.properties.Name.title[0].plain_text}</h1>
            <ProjectItem key={aProject.id} data={aProject} />
          ))}
        </div>
      </div>
    </Layout>
  );
}

// posts will be populated at build time by getStaticProps()
// export default function Blog({ posts }) {
//     return (
//       <ul>
//         {posts.map((post) => (
//           <li>{post.title}</li>
//         ))}
//       </ul>
//     )
//   }

// This function gets called at build time on "server-side"
// It won't be called on client-side, so you can even do
// direct database queries.
export async function getStaticProps() {
  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      "Notion-Version": "2022-06-28",
      "content-type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({
      sorts: [
        {
          property: "Name",
          direction: "ascending",
        },
      ],
      page_size: 100,
    }),
  };

  //   fetch('https://api.notion.com/v1/databases/${DATABASE_ID}/query', options)
  //     .then(response => response.json())
  //     .then(response => console.log(response))
  //     .catch(err => console.error(err));

  // Call an external API endpoint to get posts.
  // You can use any data fetching library
  const res = await fetch(
    `https://api.notion.com/v1/databases/${DATABASE_ID}/query`,
    options
  );
  const projects = await res.json();

  const projectName = projects.results.map(
    (aProject) => aProject.properties.Name.title[0].plain_text
  );

  //   console.log(projectName);

  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: { projects },
  };
}
