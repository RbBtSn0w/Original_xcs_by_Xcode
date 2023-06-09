%%
%% %CopyrightBegin%
%%
%% Copyright Ericsson AB 1996-2010. All Rights Reserved.
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
{application, sasl,
   [{description, "SASL  CXC 138 11"},
    {vsn, "2.3.4"},
    {modules, [sasl, 
	       alarm_handler, 
               format_lib_supp, 
               misc_supp, 
               overload, 
               rb, 
               rb_format_supp, 
	       release_handler, 
	       release_handler_1, 
	       erlsrv,
	       sasl_report, 
	       sasl_report_tty_h, 
	       sasl_report_file_h, 
	       si,
	       si_sasl_supp,
	       systools, 
	       systools_make, 
	       systools_rc, 
	       systools_relup, 
	       systools_lib
	      ]},
    {registered, [sasl_sup, alarm_handler, overload, release_handler]},
    {applications, [kernel, stdlib]},
    {env, [{sasl_error_logger, tty},
           {errlog_type, all}]},
    {mod, {sasl, []}}]}.

