function save_results()
    i_ramp = evalin('base', 'out.i_ramp_rate_first_quarter_cycle');
    
    % Try just using it directly
    if isstruct(i_ramp)
        i_ramp_rate_first_quarter_cycle_value = i_ramp.Data(end);
    else
        i_ramp_rate_first_quarter_cycle_value = i_ramp(end);
    end
    
    data = struct();
    data.i_ramp_rate_first_quarter_cycle = i_ramp_rate_first_quarter_cycle_value;
    
    json_str = jsonencode(data);
    
    fid = fopen('C:\repos\hvps\MATLAB\results.json', 'w');
    fprintf(fid, '%s', json_str);
    fclose(fid);
end