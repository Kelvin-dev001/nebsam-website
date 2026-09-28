import { PeakReadout } from './peak-readout';
import { TelemetryPanel } from './telemetry-panel';

/**
 * The stage frames for the homepage set piece, one per beat, in order. Each is
 * an ILLUSTRATION of what its step states — every value is invented for the
 * picture and labelled as such by the stage caption (brief 6.5). Anything a
 * reader needs is in the step text, never only here (ADR-0006).
 */

function FuelLevel() {
  // A static gauge: the level after an abnormal drop, with the drop marked.
  // Width only in the server HTML; nothing here animates.
  return (
    <div aria-hidden="true">
      <div className="relative h-2 rounded-data bg-border-hairline-inverse">
        <div className="absolute inset-y-0 left-0 w-[34%] rounded-data bg-text-secondary-inverse" />
        <div className="absolute inset-y-0 left-[34%] w-[38%] border border-dashed border-border-strong-inverse" />
      </div>
    </div>
  );
}

function RouteStrip() {
  // A static trip: depot geofence, the route, site geofence, the vehicle
  // arrived. Gives beat 2 a face of its own — in the T4 feel check beats 1 and
  // 2 read alike, because their frames were the same list of rows.
  return (
    <div aria-hidden="true" className="flex items-center gap-2">
      <span className="h-3 w-6 rounded-data border border-dashed border-border-strong-inverse" />
      <span className="h-px flex-1 bg-text-secondary-inverse" />
      <span className="relative h-3 w-6 rounded-data border border-dashed border-border-strong-inverse">
        <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-text-inverse" />
      </span>
    </div>
  );
}

export const FRAMES = [
  // 1 — Position
  <TelemetryPanel
    key="position"
    context="Live position"
    rows={[
      { label: 'Ignition', value: 'On' },
      { label: 'Speed', value: '38 km/h' },
      { label: 'GPS', value: 'Fix OK' },
      { label: 'Last report', value: '0:05 ago' },
    ]}
    status={{ text: 'Reporting', ok: true }}
  />,
  // 2 — History and boundaries
  <TelemetryPanel
    key="history"
    context="Route playback"
    rows={[
      { label: 'Trip', value: 'Depot → customer site' },
      { label: 'Geofence · depot', value: 'Exited 06:31' },
      { label: 'Geofence · site', value: 'Entered 07:48' },
    ]}
    status={{ text: '2 boundary alerts' }}
  >
    <RouteStrip />
  </TelemetryPanel>,
  // 3 — Fuel
  <TelemetryPanel
    key="fuel"
    context="Fuel"
    rows={[
      { label: 'Event', value: 'Abnormal level drop' },
      { label: 'How much', value: '38 L' },
      { label: 'When', value: '02:14' },
      { label: 'Where', value: 'Depot yard' },
    ]}
    status={{ text: 'Alert sent' }}
  >
    <FuelLevel />
  </TelemetryPanel>,
  // 4 — Driver and road: the quiet frame before the peak
  <TelemetryPanel
    key="camera"
    context="Video telematics"
    rows={[
      { label: 'Event', value: 'Driver behaviour' },
      { label: 'Clip', value: 'Saved with trip' },
      { label: 'KEBS BS202445237', value: 'Complies', ok: true },
    ]}
  />,
  // 5 — Signal: the peak. The only motion and the only amber on the stage.
  <PeakReadout key="signal" />,
];
