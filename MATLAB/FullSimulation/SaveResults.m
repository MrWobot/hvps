function save_results()
    i_ramp = evalin('base', 'out.i_ramp_rate_first_quarter_cycle');
    
    % Try just using it directly
    if isstruct(i_ramp)
        val = i_ramp.Data(end);
    else
        val = i_ramp(end);
    end
    
    data = struct();
    data.i_ramp_rate_first_quarter_cycle = val;
    
    json_str = jsonencode(data);
    
    fid = fopen('C:\repos\hvps\MATLAB\results.json', 'w');
    fprintf(fid, '%s', json_str);
    fclose(fid);
end