import { BoxesIcon } from '../../assets/dashboard';
import { XIcon } from '../../assets/shared';

const NoVaultsIcon = ({ className = '', style = {} }) => (
  <div
    className={className}
    style={{
      position: 'relative',
      width: 64,
      height: 64,
      display: 'inline-block',
      ...style,
    }}
  >
    <BoxesIcon
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: 64,
        height: 64,
        opacity: 0.5,
        zIndex: 1,
      }}
    />
    <XIcon
      style={{
        position: 'absolute',
        top: 8,
        left: 8,
        width: 48,
        height: 48,
        opacity: 0.6,
        zIndex: 2,
        color: 'white'
      }}
    />
  </div>
);

export default NoVaultsIcon;