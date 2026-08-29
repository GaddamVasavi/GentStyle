import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { bespokeService } from '../../services/bespoke.service';
import { LuxuryFabricSwatch, BespokeGarmentConfig, BespokeQuote, TailorAppointment } from '../../types/bespoke.types';

interface BespokeState {
  fabrics: LuxuryFabricSwatch[];
  selectedFabric: LuxuryFabricSwatch | null;
  currentConfig: BespokeGarmentConfig;
  quote: BespokeQuote | null;
  appointments: TailorAppointment[];
  isLoading: boolean;
  error: string | null;
}

const defaultConfig: BespokeGarmentConfig = {
  garmentType: 'TWO_PIECE_SUIT',
  silhouette: 'NEAPOLITAN_SOFT',
  fabricId: 'fab-loro-zelander-navy',
  lapel: 'PEAK_WIDE',
  buttons: 'SINGLE_2_BUTTON',
  pockets: 'FLAP_SLANTED_TICKET',
  vents: 'SIDE_DOUBLE_VENTS',
  lining: 'FULL_BEMBERG_SILK',
  liningPatternId: 'lining-burgundy-paisley',
  buttonMaterial: 'GENUINE_HORN_BUFFALO',
  canvasConstruction: 'FULL_FLOATING_CANVAS',
  shoulderPad: 'NATURAL_SPALLA_CAMICIA',
  trouserConfig: {
    pleats: 'SINGLE_FORWARD_PLEAT',
    cuff: '1.75_INCH_CUFF',
    waistband: 'SIDE_ADJUSTERS_BRASS',
    suspenderButtons: true,
  },
  monogram: {
    text: 'G.S.',
    font: 'SCRIPT_TRADITIONAL',
    threadColor: 'GOLDEN_ROD',
    placement: 'INSIDE_RIGHT_BREAST',
  },
};

const initialState: BespokeState = {
  fabrics: [],
  selectedFabric: null,
  currentConfig: defaultConfig,
  quote: null,
  appointments: [],
  isLoading: false,
  error: null,
};

export const fetchBespokeFabrics = createAsyncThunk('bespoke/fetchFabrics', async () => {
  const res = await bespokeService.getFabrics();
  return res.data;
});

export const computeBespokeQuote = createAsyncThunk(
  'bespoke/computeQuote',
  async (config: BespokeGarmentConfig) => {
    const res = await bespokeService.calculateQuote(config);
    return res.data;
  }
);

export const fetchBespokeAppointments = createAsyncThunk('bespoke/fetchAppointments', async () => {
  const res = await bespokeService.getAppointments();
  return res.data;
});

export const bespokeSlice = createSlice({
  name: 'bespoke',
  initialState,
  reducers: {
    updateGarmentConfig: (state, action: PayloadAction<Partial<BespokeGarmentConfig>>) => {
      state.currentConfig = { ...state.currentConfig, ...action.payload };
    },
    setSelectedFabric: (state, action: PayloadAction<LuxuryFabricSwatch>) => {
      state.selectedFabric = action.payload;
      state.currentConfig.fabricId = action.payload.id;
    },
    resetConfig: (state) => {
      state.currentConfig = defaultConfig;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBespokeFabrics.fulfilled, (state, action) => {
        state.fabrics = action.payload;
        if (!state.selectedFabric && action.payload.length > 0) {
          state.selectedFabric = action.payload[0];
        }
      })
      .addCase(computeBespokeQuote.fulfilled, (state, action) => {
        state.quote = action.payload;
      })
      .addCase(fetchBespokeAppointments.fulfilled, (state, action) => {
        state.appointments = action.payload;
      });
  },
});

export const { updateGarmentConfig, setSelectedFabric, resetConfig } = bespokeSlice.actions;
export default bespokeSlice.reducer;
