{application, public_key,
  [{description, "Public key infrastructure"},
   {vsn, "0.21"},
   {modules, [	  public_key,
		  pubkey_pem,
		  pubkey_pbe,	
		  pubkey_ssh,
		  pubkey_cert,
		  pubkey_cert_records,
		  pubkey_crl,
		  'OTP-PUB-KEY',
		  'PKCS-FRAME'
            ]},
   {applications, [asn1, crypto, kernel, stdlib]},
   {registered, []},
   {env, []}  
   ]
}.

