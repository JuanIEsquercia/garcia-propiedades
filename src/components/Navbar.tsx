
import styles from './Navbar.module.css';
import { Home, Phone, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
            <div className={`container ${styles.navContainer}`}>
                <a href="#inicio" className={styles.logo} style={{ textDecoration: 'none' }}>
                    <Home className={styles.logoIcon} />
                    <span className={styles.logoText}>GARCIA <span className={styles.logoHighlight}>PROPIEDADES</span></span>
                </a>

                <div className={`${styles.navLinks} ${mobileMenuOpen ? styles.mobileOpen : ''}`}>
                    <a href="#inicio" className={styles.navLink} onClick={() => setMobileMenuOpen(false)}>Inicio</a>
                    <a href="#servicios" className={styles.navLink} onClick={() => setMobileMenuOpen(false)}>Servicios</a>
                    <a href="https://www.inmogp.com/" target="_blank" rel="noopener noreferrer" className={styles.navLink} onClick={() => setMobileMenuOpen(false)}>Propiedades</a>
                    <a href="#nosotros" className={styles.navLink} onClick={() => setMobileMenuOpen(false)}>Nosotros</a>
                    <a href="#equipo" className={styles.navLink} onClick={() => setMobileMenuOpen(false)}>Equipo</a>
                    <a href="#contacto" className={styles.navLink} onClick={() => setMobileMenuOpen(false)}>Contacto</a>

                    <a href="https://wa.me/5493794088400" target="_blank" rel="noopener noreferrer" className={styles.contactBtn} style={{ textDecoration: 'none' }}>
                        <Phone size={18} />
                        <span>Consultas</span>
                    </a>
                </div>

                <button
                    className={styles.mobileToggle}
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
