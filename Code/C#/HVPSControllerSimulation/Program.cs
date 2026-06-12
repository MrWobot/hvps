// --- 1. Define Circuit Constants From Schematic ---
using Core.FileSystem;
using HVPSControllerSimulation;
string resultsDirectory = Path.Combine(ProjectDirectoryHelper.FindFromExecuting(), "SimulationResults");
string resultsFileName = Path.Combine(resultsDirectory, $"_{DateTime.Now.ToString("yyyy_MM_dd_HH_mm_ss")}.csv");

double Ns = 85;
double Np = 10;// --- 1. Define Circuit Constants From Schematic ---
double n = Ns/Np;           // Turns ratio (Ns/Np)
double Rp = 0.1;           // Primary resistance (Ohms)
double L_leak = 6.3e-6;     // Leakage inductance (Henries)
double L_mag = (48.2e-6 ) - L_leak;     // Magnetizing inductance (Henries)
double Rs = 3.5;           // Secondary resistance (Ohms)
double C = 1.2e-6;          // Secondary capacitance (Farads)
double dt = 1e-7;          // Time step (Seconds)
double F_sw = 16000d;
double N_QUARTER_CYCLES_RUN = 2;
double V_bus = 36;
var primaryCurrentFeedback = new PrimaryCurrentFeedback();
var controller = new Controller(F_sw, V_bus);
    // --- 2. Initialize State Variables (at t = 0) ---
double t = 0.0;
double i = 0.0;            // Source current
double i_m = 0.0;          // Magnetizing current
double v_C = 0.0;          // Actual secondary capacitor voltage

// --- 3. Initialize Energy Tracking Variables ---
double totalEnergyIn = 0.0;
double totalEnergyLoss = 0.0;

using (var resultsWriter = new ResultsWriter(resultsFileName))
{
    while (true) {
        t += dt;

        // Cache previous states for synchronous update
        double prev_i = i;
        double prev_im = i_m;
        double prev_vC = v_C;

        // Update source voltage if your controller is active
        controller.Run(t, out double V_drive, out int nQuarterCycle);
        if (nQuarterCycle >= N_QUARTER_CYCLES_RUN) {
            break;
        }
        // --- Compute Next Values with Explicit, Unsimplified Bracketing ---
        i = prev_i + (dt * ((V_drive - (Rp * prev_i) - ((Rs / (n * n)) * (prev_i - prev_im)) - (prev_vC / n)) / L_leak));

        i_m = prev_im + (dt * ((((Rs / (n * n)) * (prev_i - prev_im)) + (prev_vC / n)) / L_mag));

        v_C = prev_vC + (dt * (((prev_i - prev_im) / n) / C));

        // --- Energy Accounting Integration (Using current step values) ---
        // 1. Instantaneous secondary current 
        double i_s = (i - i_m) / n;

        // 2. Instantaneous powers
        double p_in = V_drive * i;
        double p_loss_p = i * i * Rp;
        double p_loss_s = i_s * i_s * Rs;

        // 3. Rectangular integration of power over time step (dt) to get energy
        totalEnergyIn += p_in * dt;
        totalEnergyLoss += (p_loss_p + p_loss_s) * dt;
        primaryCurrentFeedback.Run(t, i);
        resultsWriter.Append(nQuarterCycle, t, V_drive, i, i_m, v_C);
    }

    // --- 5. Post-Simulation Validation Check ---
    // Calculate exactly how much energy is trapped inside the component fields at the final instant
    double energyStoredLeak = 0.5 * L_leak * (i * i);
    double energyStoredMag = 0.5 * L_mag * (i_m * i_m);
    double energyStoredCap = 0.5 * C * (v_C * v_C);
    double totalEnergyStored = energyStoredLeak + energyStoredMag + energyStoredCap;

    // Conservation of Energy Assertion: Energy In = Energy Dissipated + Energy Stored
    double energyBalanceError = totalEnergyIn - (totalEnergyLoss + totalEnergyStored);

    // Display validation report
    Console.WriteLine("====== ENERGY BALANCE VALIDATION REPORT ======");
    Console.WriteLine($"Total Energy Input from Source:  {totalEnergyIn:G6} Joules");
    Console.WriteLine($"Total Energy Lost via Heating:   {totalEnergyLoss:G6} Joules");
    Console.WriteLine($"Total Energy Stored in Fields:   {totalEnergyStored:G6} Joules");
    Console.WriteLine($"----------------------------------------------");
    Console.WriteLine($"Absolute Energy Balance Error:   {energyBalanceError:G6} Joules");

    if (Math.Abs(energyBalanceError) < 1e-4)
    {
        Console.WriteLine("VALIDATION SUCCESS: The mathematical model fully respects conservation of energy.");
    }
    else
    {
        Console.WriteLine("VALIDATION FAILURE: Numerical drift or equation mismatch detected.");
    }
}
