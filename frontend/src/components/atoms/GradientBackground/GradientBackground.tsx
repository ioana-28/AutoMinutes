import { FC } from 'react';
import { ShaderGradientCanvas, ShaderGradient } from '@shadergradient/react';

const GradientBackground: FC = () => {
  return (
    <div className="absolute inset-0 z-[-1] overflow-hidden">
      <ShaderGradientCanvas style={{ position: 'absolute', inset: 0 }} pixelDensity={1.5} fov={45}>
        <ShaderGradient
          control="query"
          urlString="https://shadergradient.co/customize?animate=on&axesHelper=off&brightness=1.2&cAzimuthAngle=180&cDistance=3.6&cPolarAngle=90&cameraZoom=1&color1=%23cad2c5&color2=%23386641&color3=%23a4c3b2&destination=onCanvas&embedMode=off&envPreset=city&format=gif&fov=45&frameRate=10&gizmoHelper=hide&grain=off&lightType=3d&pixelDensity=1&positionX=-1.4&positionY=0&positionZ=0&range=disabled&rangeEnd=40&rangeStart=0&reflection=0.1&rotationX=0&rotationY=10&rotationZ=50&shader=defaults&type=waterPlane&uAmplitude=1&uDensity=1.3&uFrequency=5.5&uSpeed=0.1&uStrength=2.1&uTime=0&wireframe=false"
        />
      </ShaderGradientCanvas>
    </div>
  );
};

export default GradientBackground;
