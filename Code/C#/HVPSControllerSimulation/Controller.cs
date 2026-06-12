using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HVPSControllerSimulation
{
    internal class Controller
    {
        private double _V_bus;
        private double _QuarterCycleTime;
        private int _CurrentQuarterCycle = 0;
        private bool _DriveEndedForQuarter = false;
        public Controller(double F_sw, double V_bus) {
            _V_bus = V_bus;
            _QuarterCycleTime = 1d / (double)(F_sw * 4d);
        }
        public void Run(double time, out double V_drive, out int nQuarterCycle) {
            nQuarterCycle = (int)(Math.Floor(time / _QuarterCycleTime));
            if (nQuarterCycle > _CurrentQuarterCycle) {
                _DriveEndedForQuarter = false;
                _CurrentQuarterCycle = nQuarterCycle;
            }
            if (_DriveEndedForQuarter) {
                V_drive = 0;
                return;
            }
            switch (nQuarterCycle % 4) {
                case 0:
                    V_drive = _V_bus;
                    return;
                case 1:
                    V_drive = 0;
                    return;
                case 2:
                    V_drive = -_V_bus;
                    return;
                case 3:
                    V_drive = 0;
                    return;
                default:
                    throw new NotImplementedException();
            }
        }
    }
}
