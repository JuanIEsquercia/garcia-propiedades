
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Properties from '../components/Properties';
import AboutUs from '../components/AboutUs';
import Team from '../components/Team';
import Location from '../components/Location';

const LandingPage = () => {
    return (
        <div className="landing-page-wrapper">
            <Navbar />
            <Hero />
            <Services />
            <Properties />
            <AboutUs />
            <Team />
            <Location />
        </div>
    );
};

export default LandingPage;
