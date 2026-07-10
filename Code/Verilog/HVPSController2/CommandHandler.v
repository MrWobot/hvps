module CommandHandler(
	input wire clk_50Mhz,
	input wire [FPGA_COMMAND_LAST_INDEX:0] command,
	input wire [7:0] input_data,
	output reg [FPGA_STATE_LAST_INDEX:0] state,
	output reg [1:0] drive_mode,
	output reg [7:0] n_quarter_cycles_to_drive,
	output reg shut_down_h_bridge,
	input wire done_finite_quarter_cycles,
	output reg next_data_out,
	input wire next_data_ready,
	output reg clear_error,
	output reg test,
	output reg[11:0]captures_buffer_divider_count
);
initial begin
	test <=0;
	captures_buffer_divider_count<=12'd20;
end
reg [7:0] last_command = 8'b00000000;
wire[5:0] n_quarter_cycles_from_input_data;
assign n_quarter_cycles_from_input_data = ((input_data[5:0] > 6'd10) ? 6'd10 : input_data[5:0]) << 2;
always @(posedge clk_50Mhz) begin
	last_command <= command;
	next_data_out<=0;
	clear_error <= 0;
	case(command)
		FPGA_COMMAND_NONE:begin
			drive_mode<=DRIVE_MODE_NO_DRIVE;
			shut_down_h_bridge <= 1;
			state <= FPGA_STATE_NONE;
		end
		FPGA_COMMAND_CLEAR_ERROR:begin
			test <= 0;
			drive_mode<=DRIVE_MODE_NO_DRIVE;
			shut_down_h_bridge <= 1;
			state <= FPGA_STATE_CLEARED_ERROR;
			clear_error <= 1;
		end
		FPGA_COMMAND_DRIVE:begin
			drive_mode<=DRIVE_MODE_DRIVE;
			shut_down_h_bridge <= 0;
			state <= FPGA_STATE_DRIVING;
		end
		FPGA_COMMAND_SAMPLE_HALF_CYCLE:begin
			if(command==last_command)begin
				if(done_finite_quarter_cycles || (state == FPGA_STATE_SAMPLED_HALF_CYCLE))begin
					drive_mode<=DRIVE_MODE_NO_DRIVE;
					shut_down_h_bridge <= 1;
					state <= FPGA_STATE_SAMPLED_HALF_CYCLE;
				end
				else begin
				end
			end
			else begin
				n_quarter_cycles_to_drive<=8'b0010;
				captures_buffer_divider_count<=CAPTURE_BUFFERS_FASTEST_SAMPLE_RATE_DIVIDER_COUNT;
				drive_mode<=DRIVE_MODE_DRIVE_FINITE_QUARTER_CYCLES;
				shut_down_h_bridge <= 0;
				state <= FPGA_STATE_SAMPLING_HALF_CYCLE;
			end
		end
		FPGA_COMMAND_SAMPLE_FULL_CYCLE:begin
			if(command==last_command)begin
				if(done_finite_quarter_cycles || (state == FPGA_STATE_SAMPLED_FULL_CYCLE))begin
					drive_mode<=DRIVE_MODE_NO_DRIVE;
					shut_down_h_bridge <= 1;
					state <= FPGA_STATE_SAMPLED_FULL_CYCLE;
				end
				else begin
				end
			end
			else begin
				n_quarter_cycles_to_drive<=8'b0100;
				captures_buffer_divider_count<=CAPTURE_BUFFERS_FASTEST_SAMPLE_RATE_DIVIDER_COUNT;
				drive_mode<=DRIVE_MODE_DRIVE_FINITE_QUARTER_CYCLES;
				shut_down_h_bridge <= 0;
				state <= FPGA_STATE_SAMPLING_FULL_CYCLE;
			end
		end
		FPGA_COMMAND_RUN_N_CYCLES:begin
			if(command==last_command)begin
				if(done_finite_quarter_cycles ||(state == FPGA_STATE_RAN_N_CYCLES))begin
					drive_mode<=DRIVE_MODE_NO_DRIVE;
					shut_down_h_bridge <= 1;
					state <= FPGA_STATE_RAN_N_CYCLES;
				end
				else begin
				end
			end
			else begin
				if(input_data[5:0]==6'd1)begin
					test<=1;
				end
				n_quarter_cycles_to_drive <= n_quarter_cycles_from_input_data;
				captures_buffer_divider_count <= 
						((CAPTURE_BUFFERS_N_RUN_CYCLES_TO_N_CLOCK_CYCLES_DIVIDER * input_data[7:0]) < CAPTURE_BUFFERS_FASTEST_SAMPLE_RATE_DIVIDER_COUNT)   
						? CAPTURE_BUFFERS_FASTEST_SAMPLE_RATE_DIVIDER_COUNT   
						:(
							((CAPTURE_BUFFERS_N_RUN_CYCLES_TO_N_CLOCK_CYCLES_DIVIDER * input_data[7:0]) > CAPTURE_BUFFERS_SLOWEST_SAMPLE_RATE_DIVIDER_COUNT) 
							? CAPTURE_BUFFERS_SLOWEST_SAMPLE_RATE_DIVIDER_COUNT 
							:(CAPTURE_BUFFERS_N_RUN_CYCLES_TO_N_CLOCK_CYCLES_DIVIDER * input_data[7:0])
						);
				drive_mode<=DRIVE_MODE_DRIVE_FINITE_QUARTER_CYCLES;
				shut_down_h_bridge <= 0;
				state <= FPGA_STATE_RUNNING_N_CYCLES;
			end
		end
		FPGA_COMMAND_READ_NEXT_DATA_BYTES:begin
			drive_mode<=DRIVE_MODE_NO_DRIVE;
			shut_down_h_bridge <= 1;
			next_data_out<=1;
			if(command==last_command)begin
				if(next_data_ready) begin
					state <= FPGA_STATE_NEXT_DATA_BYTES;
				end
			end
		end
		default:begin
			drive_mode<=DRIVE_MODE_NO_DRIVE;
			shut_down_h_bridge <= 1;
		end
	endcase
end
endmodule