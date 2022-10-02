import Navbar from './Navbar'
import Footer from './Footer'
import Sidebar from './Sidebar'

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen z-50 font-serif bg-gradient-to-b xs:bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-850 dark:to-gray-750">
            <div className="relative dark:mix-blend-overlay">
                <div className="fixed top-1/2 left-1/2 z-0 w-[36rem] h-[36rem] bg-purple-300 rounded-full object-cover mix-blend-multiply filter blur-2xl dark:blur-3xl opacity-30 dark:opacity-50 animate-blob-1"></div>
                <div className="fixed top-1/2 left-1/2 z-0 w-[36rem] h-[36rem] bg-yellow-300 rounded-full object-cover mix-blend-multiply filter blur-2xl dark:blur-3xl opacity-30 dark:opacity-50 animate-blob-2"></div>
                <div className="fixed top-1/2 left-1/2 z-0 w-[36rem] h-[36rem] bg-pink-300 rounded-full object-cover mix-blend-multiply filter blur-2xl dark:blur-3xl opacity-30 dark:opacity-50 animate-blob-3"></div>
            </div>
            <Navbar />
            <Sidebar />
            <main className="flex flex-col z-10 mt-16 sm:ml-20 md:ml-60 xl:ml-72">
                {children}
                <Footer />
            </main>
        </div>
    )
}

export default Layout
