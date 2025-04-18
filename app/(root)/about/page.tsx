import { Button } from "@/components/ui/button";
import { Camera, Aperture, Users, Globe } from "lucide-react";
import Link from "next/link";

function AboutPage() {
  return (
    <div className="flex flex-col items-center">
      <div className="max-w-4xl w-full text-center space-y-6">
        <div className="flex justify-center items-center gap-2">
          <Aperture size={50} />
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-800">
            About ChitraSetu
          </h1>
        </div>
        <p className="text-lg text-gray-600 leading-relaxed">
          Welcome to <strong>ChitraSetu</strong>, the ultimate bridge between
          stunning visuals and seamless eCommerce. Our platform is designed to
          revolutionize the way you buy and sell by putting images at the heart
          of every interaction. Whether you&apos;re a seller showcasing your
          products or a buyer exploring vibrant collections,{" "}
          <strong>ChitraSetu</strong> makes the process simple, intuitive, and
          visually engaging. With our image-first approach, discover a
          marketplace where every picture tells a story and every trade becomes
          effortless. Experience a new way of connecting through commerce. With{" "}
          <strong>ChitraSetu</strong>, it’s not just about trade, it’s about
          seeing the possibilities.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="p-6 bg-white rounded-lg shadow-md text-left space-y-4">
            <Camera size={40} />
            <h2 className="text-xl font-semibold text-gray-800">
              Discover Stunning Visuals
            </h2>
            <p className="text-gray-600">
              Browse a wide collection of high-quality images and assets,
              handpicked by talented creators worldwide.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md text-left space-y-4">
            <Users size={40} />
            <h2 className="text-xl font-semibold text-gray-800">
              Join a Creative Community
            </h2>
            <p className="text-gray-600">
              Connect with photographers and artists, share your passion, and
              collaborate on exciting projects.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md text-left space-y-4">
            <Globe size={40} />
            <h2 className="text-xl font-semibold text-gray-800">
              Reach Global Buyers
            </h2>
            <p className="text-gray-600">
              Sell your creations to an international audience with tools that
              ensure a smooth and secure transaction process.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md text-left space-y-4">
            <Aperture size={40} />
            <h2 className="text-xl font-semibold text-gray-800">
              Empower Your Creativity
            </h2>
            <p className="text-gray-600">
              Monetize your skills and passion with a platform that values and
              supports creators.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center">
        <h3 className="text-2xl font-bold text-gray-800">
          Ready to Join ChitraSetu?
        </h3>
        <p className="text-gray-600 mt-2">
          Whether you&apos;re a buyer or a creator, ChitraSetu is here to help
          you make your mark.
        </p>
        <Link href={"/login"}>
          <Button variant={"outline"} className="mt-4 px-6 py-3 ">
            Get Started Now
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default AboutPage;
