"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";

const utilities = [
  {
    title: "Multi-Format Data Support",
    description:
      "Upload NetCDF, GeoTIFF, or CSV files from various satellite sensors including TROPOMI, OMI, and MODIS.",
    image:
      "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Advanced ML Models",
    description:
      "Choose from CNN, U-Net, and transformer-based models trained on extensive satellite and ground truth datasets.",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Enhanced Resolution Maps",
    description:
      "Generate detailed environmental maps at 250m-1km resolution with uncertainty quantification and validation metrics.",
    image:
      "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

const ThreeColumnImageCards = () => {
  const router = useRouter();

  const handleLearnMore = () => {
    router.push('/docs');
  };

  return (
    <section className="py-32 bg-background">
      <div className="container">
        <div className="m-auto mb-24 max-w-xl text-center">
          <h2 className="mb-6 text-3xl font-semibold lg:text-5xl">
            How Satellite Downscaling Works
          </h2>
          <p className="m-auto max-w-3xl text-lg lg:text-xl">
            Our AI-powered pipeline transforms low-resolution satellite observations into high-resolution environmental maps through advanced machine learning techniques.
          </p>
          <div className="mt-8 flex flex-col items-center space-y-2">
            <Button
              className="rounded-xl"
              size="lg"
              onClick={handleLearnMore}
            >
              Learn More
            </Button>
          </div>
        </div>
        <div className="mt-11 grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {utilities.map((utility, index) => (
            <Card key={index} className="border-0 pt-0">
              <img
                src={utility.image}
                alt={utility.title}
                className="aspect-video w-full rounded-t-xl object-cover"
              />
              <div className="p-5">
                <p className="mb-1 font-medium">{utility.title}</p>
                <p className="text-muted-foreground">{utility.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export { ThreeColumnImageCards };