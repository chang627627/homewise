// Generated photography for every photo slot in the app (Figma AI, gpt-image).
// Keys are referenced by the `photo` field on slot data; v2/Photo (and V1's PhotoFill) render them.

import acCondenser from '../assets/photos/ac-condenser.jpg';
import baylinePipeRepair from '../assets/photos/bayline-pipe-repair.jpg';
import baylineSinkInstall from '../assets/photos/bayline-sink-install.jpg';
import behindPanel from '../assets/photos/behind-panel.jpg';
import faucetBase from '../assets/photos/faucet-base.jpg';
import faucetBaseAfter from '../assets/photos/faucet-base-after.jpg';
import greenvalleySink from '../assets/photos/greenvalley-sink.jpg';
import jasonSinkRepair from '../assets/photos/jason-sink-repair.jpg';
import jasonToilet from '../assets/photos/jason-toilet.jpg';
import jasonWaterHeater from '../assets/photos/jason-water-heater.jpg';
import mikeFaucet from '../assets/photos/mike-faucet.jpg';
import mikeSinkRepair from '../assets/photos/mike-sink-repair.jpg';
import pTrapNew from '../assets/photos/p-trap-new.jpg';
import sarahwellsBathroom from '../assets/photos/sarahwells-bathroom.jpg';
import underSink from '../assets/photos/under-sink.jpg';
import underSinkAfter from '../assets/photos/under-sink-after.jpg';

export const photos = {
  'ac-condenser': acCondenser,
  'bayline-pipe-repair': baylinePipeRepair,
  'bayline-sink-install': baylineSinkInstall,
  'behind-panel': behindPanel,
  'faucet-base': faucetBase,
  'faucet-base-after': faucetBaseAfter,
  'greenvalley-sink': greenvalleySink,
  'jason-sink-repair': jasonSinkRepair,
  'jason-toilet': jasonToilet,
  'jason-water-heater': jasonWaterHeater,
  'mike-faucet': mikeFaucet,
  'mike-sink-repair': mikeSinkRepair,
  'p-trap-new': pTrapNew,
  'sarahwells-bathroom': sarahwellsBathroom,
  'under-sink': underSink,
  'under-sink-after': underSinkAfter,
};

// Photo-read pins: the spot the agent read, as % of the 4:3 frame, measured
// on the images themselves. The after shots are framed differently, so each
// carries its own coordinates for the same physical spot.
export const photoPins = {
  'under-sink': { x: 53.5, y: 50 }, // where the drip leaves the P-trap
  'faucet-base': { x: 52.5, y: 70.5 }, // water pooled at the front of the base
  'under-sink-after': { x: 52, y: 52 }, // same trap bend, new PVC, dry
  'faucet-base-after': { x: 52, y: 58 }, // same edge of the base, dry
  'ac-condenser': { x: 36, y: 59 }, // matted fins on the side coil
};
