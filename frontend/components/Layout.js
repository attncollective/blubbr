import Navbar from './Navbar'
import Footer from './Footer'
import Sidebar from './Sidebar'
import Image from 'next/image'

const Layout = ({ children }) => {
    return (
        <>
            <div className="font-serif min-h-screen bg-gradient-to-b xs:bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-850 dark:to-gray-750">
                <div className="relative w-full max-w-xl dark:mix-blend-overlay">
                    <div className="fixed top-1/2 left-1/2 z-0 w-[36rem] h-[36rem] bg-purple-300 rounded-full object-cover mix-blend-multiply filter blur-2xl dark:blur-3xl opacity-30 dark:opacity-50 animate-blob-1"></div>
                    <div className="fixed top-1/2 left-1/2 z-0 w-[36rem] h-[36rem] bg-yellow-300 rounded-full object-cover mix-blend-multiply filter blur-2xl dark:blur-3xl opacity-30 dark:opacity-50 animate-blob-2"></div>
                    <div className="fixed top-1/2 left-1/2 z-0 w-[36rem] h-[36rem] bg-pink-300 rounded-full object-cover mix-blend-multiply filter blur-2xl dark:blur-3xl opacity-30 dark:opacity-50 animate-blob-3"></div>
                </div>
                <Navbar />
                <Sidebar />
                <main className="flex min-h-screen z-10">{children}</main>
                <Footer />
            </div>
        </>
    )
}

export default Layout
