import { Routes, Route } from 'react-router-dom'
import SiteLayout from './layouts/SiteLayout'
import Home from './pages/Home'
import Pricing from './pages/Pricing'
import About from './pages/About'
import Faq from './pages/Faq'
import Privacy from './pages/Privacy'
import Integrations from './pages/Integrations'
import Changelog from './pages/Changelog'
import Glossary from './pages/Glossary'
import Roadmap from './pages/Roadmap'
import Status from './pages/Status'
import BlogIndex from './pages/blog/BlogIndex'
import BlogPost from './pages/blog/BlogPost'
import ProductDetail from './pages/products/ProductDetail'
import NotFound from './pages/NotFound'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/integrations" element={<Integrations />} />
        <Route path="/changelog" element={<Changelog />} />
        <Route path="/glossary" element={<Glossary />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/status" element={<Status />} />
        <Route path="/blog" element={<BlogIndex />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/products/:slug" element={<ProductDetail />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
