%% This is an -*- erlang -*- file.
%% %CopyrightBegin%
%%
%% Copyright Ericsson AB 1997-2014. All Rights Reserved.
%%
%% The contents of this file are subject to the Erlang Public License,
%% Version 1.1, (the "License"); you may not use this file except in
%% compliance with the License. You should have received a copy of the
%% Erlang Public License along with this software. If not, it can be
%% retrieved online at http://www.erlang.org/.
%%
%% Software distributed under the License is distributed on an "AS IS"
%% basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See
%% the License for the specific language governing rights and limitations
%% under the License.
%%
%% %CopyrightEnd%
%% 

{application,inets,
 [{description, "INETS  CXC 138 49"},
  {vsn, "5.9.8"},
  {modules,[
            inets,
            inets_sup,
            inets_app,
	    inets_service,	                  
	    inets_regexp,	                  
	    inets_trace,	                  

            %% FTP
            ftp,
	    ftp_progress,	
	    ftp_response,		
            ftp_sup,
            
            %% HTTP client:
            httpc, 
            httpc_handler,
	    httpc_handler_sup,	
            httpc_manager,
	    httpc_profile_sup,		
            httpc_request,
            httpc_response,     
            httpc_sup,
            httpc_cookie,                

	    http_uri, %% Proably will by used by server also in the future

            %% HTTP used by both client and server 
            http_chunk,
            http_request,
            http_response,      
            http_transport,
            http_util,  
            
            %% HTTP server:
            httpd,
            httpd_acceptor,
            httpd_acceptor_sup,
	    httpd_cgi,
	    httpd_connection_sup,
            httpd_conf,
	    httpd_esi,
            httpd_example,
	    httpd_file,
            httpd_instance_sup,
	    httpd_log,
            httpd_manager,
            httpd_misc_sup,
            httpd_request,
            httpd_request_handler,
            httpd_response,
	    httpd_script_env,
            httpd_socket,
            httpd_sup,
            httpd_util,
            mod_actions,
            mod_alias,
            mod_auth,
            mod_auth_dets,
            mod_auth_mnesia,
            mod_auth_plain,
            mod_auth_server,
            mod_browser,
            mod_cgi,
            mod_dir,
            mod_disk_log,
            mod_esi,
            mod_get,
            mod_head,
            mod_htaccess,
            mod_include,
            mod_log,
            mod_range,
            mod_responsecontrol,
            mod_security,
            mod_security_server,
            mod_trace,
            
            %% TFTP
            tftp,
            tftp_binary,
            tftp_engine,
            tftp_file,
            tftp_lib,
            tftp_logger,
            tftp_sup
        ]},
  {registered,[inets_sup, httpc_manager]},
  %% If the "new" ssl is used then 'crypto' must be started before inets.
  {applications,[kernel,stdlib]},
  {mod,{inets_app,[]}}]}.
