import React from 'react';
import { Image } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PhotoDisplayProps {
  imageUrl?: string | null;
}

const PhotoDisplay: React.FC<PhotoDisplayProps> = ({ imageUrl }) => {
  if (!imageUrl) {
    return (
      <Card className="bg-gray-50">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Image size={48} className="text-gray-400" />
          <p className="mt-4 text-gray-500">
            No image available
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Topic Image</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center items-center overflow-hidden rounded-md shadow-sm bg-gray-50">
          <img
            src={imageUrl}
            alt="Topic Image"
            className="max-w-full h-auto max-h-96 object-contain"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PhotoDisplay;