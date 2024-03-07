import Header from "../components/Header";
import Hero from "../components/Hero";
import Footer from "../components/Footer";

interface Props{
  children: React.ReactNode;
}
//layout file  which has our sde title and it has our sign in button just need to add the component to the routes
const Layout = ({children}: Props) => {
    return (
        <div className="flex flex-col min-h-screen">
      <Header />
      <Hero />
      <div className="contaner mx-auto py-10 flex-1">{children}</div>
      <Footer />
        </div>
    )
};

export default Layout;