{application, ssl,
   [{description, "Erlang/OTP SSL application"},
    {vsn, "5.3.3"},
    {modules, [
	       %% TLS/SSL 
	       tls_connection,
	       tls_handshake,
	       tls_record,
	       tls_v1,
	       ssl_v3,
	       ssl_v2,
	       %% DTLS
	       dtls_connection,
	       dtls_handshake,
	       dtls_record,
	       dtls_v1,
	       %% API
	       ssl,  %% Main API		  
	       tls,  %% TLS specific
	       dtls, %% DTLS specific 
	       ssl_session_cache_api,
	       %% Both TLS/SSL and DTLS
	       ssl_config,
	       ssl_connection,
	       ssl_handshake,
	       ssl_record,
	       ssl_cipher,
	       ssl_srp_primes,
	       ssl_alert,
	       ssl_socket,
	       %% Erlang Distribution over SSL/TLS
	       inet_tls_dist,
	       ssl_tls_dist_proxy,
	       ssl_dist_sup,
	       %% SSL/TLS session handling
	       ssl_session,
	       ssl_session_cache,
	       ssl_manager,
	       ssl_pkix_db,
	       ssl_certificate,
	       %% App structure
	       ssl_app,
	       ssl_sup,
	       tls_connection_sup,
	       dtls_connection_sup	
	       ]},
    {registered, [ssl_sup, ssl_manager]},
    {applications, [crypto, public_key, kernel, stdlib]},
    {env, []},
    {mod, {ssl_app, []}}]}.


