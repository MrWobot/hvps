module CaptureBuffers(
    input wire clk_50Mhz,
    input wire capture,
    input wire [7:0] primary_current_raw,
    input wire [7:0] output_voltage_raw,
    input wire [7:0] first_stage_voltage_raw,
    output reg [INTERFACE_BUFFERED_DATA_LAST_INDEX:0] output_buffered_data,
    input wire next_data_out,
    output reg next_data_ready
);

localparam STATE_IDLE = 3'd0;
localparam STATE_BEGIN_CAPTURE = 3'd1;
localparam STATE_CAPTURING = 3'd2;
localparam STATE_BEGIN_NEXT_DATA_OUT_0 = 3'd3;  // one clock pipeline fill
localparam STATE_BEGIN_NEXT_DATA_OUT_1_WRITE_FIRST_PART_LENGTH = 3'd4;
localparam STATE_BEGIN_NEXT_DATA_OUT_2_WRITE_SECOND_PART_LENGTH = 3'd5;
localparam STATE_BEGIN_NEXT_DATA_OUT_3 = 3'd6;
localparam STATE_NEXT_DATA_OUT = 3'd7;

reg [2:0] state = STATE_IDLE;

reg [4:0] divider = 0;
reg [9:0] n_byte_shifts_left_to_do = 10'd0;
reg [9:0] n_captured_bytes_left_to_shift = 10'd0;
reg [2:0] read_bit = 0;

// Port A — write
reg[9:0] next_write_address = 10'd0;
reg [9:0] ram_addr_write = 10'd0;
reg [7:0] ram_data_write;
reg ram_do_write;

// Port B — read
reg [1:0]wait_for_ram = 1'd0;
reg [9:0] ram_addr_read = 10'd0;
wire [7:0] ram_data_read;//[/]
wire is_first_read;//[/]
assign is_first_read = (ram_addr_read == 10'd0);//[/]

reg [9:0] bytes_length = 10'd0;
reg [7:0]n_captures_done = 8'd0;
altsyncram altsyncram_component (
    .clock0(clk_50Mhz),// Port A clock. All Port A operations (write) are synchronous to this.
    .clock1(clk_50Mhz),//Port B clock. All Port B operations (read) are synchronous to this. Both ports on same 50MHz clock.
    // Port A — write
    .address_a(ram_addr_write),//Port A address input. Where you're writing to.
    .data_a(ram_data_write),//Port A data input. What you're writing.
    .wren_a(ram_do_write),//Port A write enable. High = write this clock.
    .q_a(),//Port A data output. Left unconnected because you never read from Port A.
    // Port B — read
    .address_b(ram_addr_read),//Port B address input. Where you're reading from.
    .q_b(ram_data_read),//Port B data output. The byte you read.
    .wren_b(1'b0),//Port B write enable permanently low. Port B is read only.
    .data_b(8'd0),//Port B data input. Tied to 0 since we never write from Port B.
    // Unused
    .aclr0(1'b0),//Asynchronous clear for ports A and B. Disabled. You don't want the RAM randomly clearing.
    .aclr1(1'b0),
    .addressstall_a(1'b0),//Address stall inputs. If high, the address register doesn't update. Disabled — you always want the address to update. 
    .addressstall_b(1'b0),
    .byteena_a(1'b1),//Byte enable. Since width is 8 bits (one byte) this is just one bit, always enabled.
    .byteena_b(1'b1),
    .clocken0(1'b1),//Clock enable for clocks 0 and 1. Always enabled. 
    .clocken1(1'b1),
    .clocken2(1'b1),//Additional clock enables required by the primitive interface. Tied high, not functionally used. 
    .clocken3(1'b1),
    .eccstatus(),//Error correction status output. Left unconnected — you're not using ECC.
    .rden_a(1'b1),/*Read enable for both ports. Always enabled. For Port A this doesn't matter since q_a is unconnected. 
						For Port B keeping it high means the output register always updates — you want this.*/
    .rden_b(1'b1)
);
defparam
    altsyncram_component.address_reg_b = "CLOCK1",/*Port B address register is clocked by clock1. 
	 Means ram_addr_read is registered on the rising edge of clock1, 
	 then one clock later ram_data_read has the result. 
	 This is the registered read that gives M9K proper inference. */
    altsyncram_component.clock_enable_input_a = "BYPASS",/*Clock enable for Port A input register is bypassed. Since clocken0 is tied high this is consistent. */
    altsyncram_component.clock_enable_input_b = "BYPASS",//Same for Port B.
    altsyncram_component.clock_enable_output_b = "BYPASS",//Clock enable for Port B output register bypassed. Output always updates.
    altsyncram_component.intended_device_family = "Cyclone IV E",/*Tells Quartus which M9K architecture to target. Must match your EP4CE6E22C8N. */
    altsyncram_component.lpm_hint = "ENABLE_RUNTIME_MOD=NO",/*Disables runtime modification of the RAM contents via JTAG. You don't want someone poking the RAM while it's running.*/
    altsyncram_component.lpm_type = "altsyncram",/*Identifies this as an altsyncram primitive. Required boilerplate.*/
    altsyncram_component.numwords_a = CAPTURE_BUFFERS_RAM_LENGTH_BYTES,/* Port A has 768 addressable locations. 768 bytes. */
    altsyncram_component.numwords_b = CAPTURE_BUFFERS_RAM_LENGTH_BYTES,/* Port B same.*/
    altsyncram_component.operation_mode = "BIDIR_DUAL_PORT",/*Both ports can read and write independently. Even though Port B is wired read-only, this mode gives you truly independent ports.*/
    altsyncram_component.outdata_aclr_b = "NONE",/*No asynchronous clear on Port B output register.*/
    altsyncram_component.outdata_reg_b = "UNREGISTERED",
    altsyncram_component.power_up_uninitialized = "FALSE",/*RAM initialises to 0 on power up. This is what handles header byte 1 being 0 on first boot.*/
    altsyncram_component.read_during_write_mode_mixed_ports = "DONT_CARE",/*What happens if Port A writes and Port B reads the same address simultaneously. You've set DONT_CARE because your protocol guarantees capture and readout never overlap. */
    altsyncram_component.widthad_a = 10,/*Port A address is 10 bits wide. 2^10 = 1024 possible addresses, you're using 768 of them. */
    altsyncram_component.widthad_b = 10,//Port A address is 10 bits wide. 2^10 = 1024 possible addresses, you're using 768 of them. 
    altsyncram_component.width_a = 8,//Port A data width is 8 bits — one byte per location.
    altsyncram_component.width_b = 8,//Same for Port B.
    altsyncram_component.width_byteena_a = 1/*Byte enable width matches one byte.*/;

always @(posedge clk_50Mhz) begin
    // Default — no write, read address tracks read_addr
	ram_do_write <= 0;
	//ram_addr_read <= read_addr;

	// Capture rising edge — reset write pointer, write header
	case (state)
		STATE_IDLE:begin
			ram_do_write <= 0;
			if(capture == 1'b1)begin
				state <= STATE_BEGIN_CAPTURE;
			end
			else 
			begin 
				if(next_data_out == 1'b1) begin
					state <= STATE_BEGIN_NEXT_DATA_OUT_0;
				end
			end
		end
		STATE_BEGIN_CAPTURE:begin
			ram_addr_read <= 10'd0;
			n_captured_bytes_left_to_shift <=10'd0;
			next_write_address <= 10'd2;
			divider <= 0;
			bytes_length  <= 10'd2;
			state <= STATE_CAPTURING;
		end
		STATE_CAPTURING:begin
			if(capture == 1'b0) begin
				state <= STATE_IDLE;
			end
			else begin
				if(divider<5'd20)begin
					divider <= divider + 5'd1;
				end
				else begin
					divider <= 0;
				end
				if(next_write_address < CAPTURE_BUFFERS_RAM_LAST_INDEX)begin
					case(divider)
						5'd18:
						begin
							next_write_address <= next_write_address + 10'd1;
							bytes_length  <= bytes_length + 10'd1;
							ram_addr_write <= next_write_address;
							ram_data_write <= primary_current_raw;
							ram_do_write <= 1;
						end
						5'd19:
						begin
						  next_write_address <= next_write_address + 10'd1;
						  bytes_length  <= bytes_length + 10'd1;
						  ram_addr_write <= next_write_address;
						  ram_data_write <= output_voltage_raw;
						  ram_do_write <= 1;
						end
						5'd20:
						begin
							next_write_address <= next_write_address + 10'd1;
							bytes_length  <= bytes_length + 10'd1;
							ram_addr_write <= next_write_address;
							ram_data_write <= first_stage_voltage_raw;
							ram_do_write <= 1;
						end
					endcase
				end
			end
		end
		STATE_BEGIN_NEXT_DATA_OUT_0:begin
			next_data_ready <= 0;
			read_bit <= 0;
			if(is_first_read)begin
				state <= STATE_BEGIN_NEXT_DATA_OUT_1_WRITE_FIRST_PART_LENGTH;
			end
			else begin
				//bytes_length <= 10'd7;//TODO delete
				state <= STATE_BEGIN_NEXT_DATA_OUT_3;
			end
		end
		STATE_BEGIN_NEXT_DATA_OUT_1_WRITE_FIRST_PART_LENGTH:begin
			ram_addr_write <= 10'd0;
			ram_data_write <= bytes_length[7:0];
			ram_do_write <= 1;
			state <= STATE_BEGIN_NEXT_DATA_OUT_2_WRITE_SECOND_PART_LENGTH;
		end
		STATE_BEGIN_NEXT_DATA_OUT_2_WRITE_SECOND_PART_LENGTH:begin
			ram_addr_write <= 10'd1;
			ram_data_write <= bytes_length[9:8];
			ram_do_write <= 1;
			state <= STATE_BEGIN_NEXT_DATA_OUT_3;
		end
		STATE_BEGIN_NEXT_DATA_OUT_3:begin
			next_write_address <= 10'b0;
			n_byte_shifts_left_to_do <= INTERFACE_BUFFERED_DATA_LENGTH_BYTES_10BITS;
			n_captured_bytes_left_to_shift <= (bytes_length  - ram_addr_read)>INTERFACE_BUFFERED_DATA_LENGTH_BYTES_10BITS  
				?INTERFACE_BUFFERED_DATA_LENGTH_BYTES_10BITS :(bytes_length   - ram_addr_read);
			read_bit <= 3'd0;
			state <= STATE_NEXT_DATA_OUT;
		end
		STATE_NEXT_DATA_OUT:begin
			if(wait_for_ram > 1'd0)begin
				wait_for_ram <= wait_for_ram - 1'd1;
			end
			else
			begin
				if(n_byte_shifts_left_to_do == 10'd0)begin
					next_data_ready <= 1;
					if(next_data_out==1'b0)begin
						state <= STATE_IDLE;
					end
				end
				else begin
					if(n_captured_bytes_left_to_shift ==0) begin
						n_byte_shifts_left_to_do <=n_byte_shifts_left_to_do - 10'd1;
						output_buffered_data <= {8'd0, output_buffered_data[INTERFACE_BUFFERED_DATA_LAST_INDEX:8]};
					end
					else begin
						output_buffered_data <= {ram_data_read, output_buffered_data[INTERFACE_BUFFERED_DATA_LAST_INDEX:8]};
						ram_addr_read <= ram_addr_read + 10'd1;
						wait_for_ram <= 1'd1;
						n_captured_bytes_left_to_shift <= n_captured_bytes_left_to_shift - 10'd1;
						n_byte_shifts_left_to_do <= n_byte_shifts_left_to_do - 10'd1;
					end
				end 
			end
		end
	endcase
end
endmodule