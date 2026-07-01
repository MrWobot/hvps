module BangBangController(
	 input wire clk,
    input wire [7:0] primary_current_raw,
    input wire [7:0] first_stage_voltage_raw,
    input wire [7:0] output_voltage_raw,
    input wire [7:0] desired_output_voltage,
    output wire can_drive,
	 input wire h_bridge_on
);
assign can_drive =
					(primary_current_raw < MAX_PRIMARY_CURRENT)
					&&(first_stage_voltage_raw < MAX_FIRST_STAGE_VOLTAGE)
					&&(output_voltage_raw < desired_output_voltage)
					&&(output_voltage_raw < MAX_OUTPUT_VOLTAGE)
					;
endmodule