module ErrorsManager(
    input wire clk_50MHz,
    input wire primary_current_adc_timed_out,
    input wire first_stage_voltage_adc_timed_out,
    input wire output_voltage_adc_timed_out,
	 output reg[7:0] error,
	 output wire in_error,
	 input wire clear_error
);
assign in_error = error!=8'b0;
initial begin
    error = 8'b0;
end
always @(posedge clk_50MHz) begin
	if(clear_error)begin
		error <= 8'b0;
	end
	else if(error==8'b0) begin
		if(primary_current_adc_timed_out==1'b1) begin
			error <= FPGA_ERROR_PRIMARY_CURRENT_ADC_TIMED_OUT;
		end
		else if(first_stage_voltage_adc_timed_out==1'b1)
		begin
				error <= FPGA_ERROR_FIRST_STAGE_VOLTAGE_ADC_TIMED_OUT;
		end
		else if(output_voltage_adc_timed_out==1'b1)
		begin
				error <= FPGA_ERROR_OUTPUT_VOLTAGE_ADC_TIMED_OUT;
		end
	end
end
endmodule