const Footer = () => {
  return (
    <footer className="bg-blue-600 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">© Copyright by TeknoMücahit</p>
          </div>
          
          <div className="flex space-x-6">
            <a href="#" className="hover:text-blue-200">Hakkımızda</a>
            <a href="#" className="hover:text-blue-200">İletişim</a>
            <a href="#" className="hover:text-blue-200">Gizlilik Politikası</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 