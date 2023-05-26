((js2-mode . ((eval . (progn
                        (defun my-run-js-test ()
                          (let ((command (format "xcsd/bin/test %s --no-colors | cat" (buffer-file-name))))
                            (compilation-start command)))
                        (setq projectile-project-compilation-cmd #'my-run-js-test))))))
