// src/app/components/Hero.tsx (ensure the correct path and file name)
import logo1 from "@/app/assets/OmniShield Logo.png";
const Hero = () => {
  return (
    <div className="min-h-[81vh] pt-10 flex items-center justify-center">
      <div>
        <img
          src={logo1.src}
          alt="Logo"
          className="mx-auto mb-5" // Center the image and add margin
          style={{ width: "45%", height: "auto" }} // Adjust width and height as needed
        />
      </div>
    </div>
  );
};

export default Hero;




