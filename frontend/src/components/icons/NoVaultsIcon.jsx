import { BoxesIcon } from '../../assets/dashboard';
import { XIcon } from '../../assets/shared';

const NoVaultsIcon = ({ className = '', style = {}, size = 64 }) => {
  const xIconSize = size * (48 / 64);
  const xIconTopLeft = size * (8 / 64);

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: size,
        height: size,
        display: 'inline-block',
        ...style,
      }}
      aria-hidden='true'
    >
      <BoxesIcon
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: size,
          height: size,
          opacity: 0.5,
          zIndex: 1,
        }}
      />
      <XIcon
        style={{
          position: 'absolute',
          top: xIconTopLeft,
          left: xIconTopLeft,
          width: xIconSize,
          height: xIconSize,
          opacity: 0.6,
          zIndex: 2,
          color: 'white'
        }}
      />
    </div>
  );
};

export default NoVaultsIcon;