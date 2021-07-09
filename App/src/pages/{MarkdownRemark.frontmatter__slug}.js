import React from "react"
import * as Gatsby from "gatsby"

export default function Template({
  data, // this prop will be injected by the GraphQL query below.
}) {
  const { markdownRemark } = data // data.markdownRemark holds your page data
  const { frontmatter, html } = markdownRemark
  return (
    <div className="page-container">
      <h1>{frontmatter.title}</h1>
      <div
        className="page-content"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}

// using markdownRemark to transform the markdown page to HTML using the format above,
// retrieves the page from wherever webpack put it
export const pageQuery = Gatsby.graphql`
  query($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        slug
        title
      }
    }
  }
`