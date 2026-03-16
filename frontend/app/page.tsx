import Image from "next/image";
import Navbar from "./Components/Sections/Navbar";
import IntroSection from "./Components/Sections/IntroSection";
import HowitWorks from "./Components/Sections/HowitWorks";
import Footer from "./Components/Sections/Footer";
export default function Home() {
  return (
    <div className="flex flex-col gap-4">
      <Navbar/>
      <IntroSection/>
      <HowitWorks/>
      <Footer/>
    </div>
  );
}
