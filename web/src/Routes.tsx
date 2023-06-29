// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

import { Router, Route } from '@redwoodjs/router'

const Routes = () => {
  return (
    <Router>
      <Route path="/auto" page={AutoFormPage} name="autoForm" />
      <Route path="/" page={CreateUserPage} name="create" />
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
