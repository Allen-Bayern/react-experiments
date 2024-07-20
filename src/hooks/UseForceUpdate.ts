import { useBool } from './UseToggle';

/** 强制渲染组件 */
export const useForceUpdate = () => useBool()[1];
