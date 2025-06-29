https://wtf-my-code.works/rr-diagram/?start=Line&grammargzip=H4sIAAAAAAAAE33SWU8CMRDA8fd-ism823if8UEFLxC8wCvEcFRchVXLoiLLdzf8WVaJYB9-baaTmSbTfBA6Ga9tyYaR70lfdEuT80CsGZ3SpJzrlautrpNYCt12zXmxJo2lKaKbOnEvv_rkXRQ5X_SlsOF8p_7infTTYCZoBtHE3fARSalxhTvROZWKkCz9ZB8M41b_RCtijZnSNC2nVZVYtIZ1bKDDB2ziIwb4hM_YwjaG-IKv-IYeOxhhF9_xAz-xh19qZNaKRXdI2sU9zGAW9_EAD_EIjzGHeTzBAhbxFM_wHC_wEktYxiu8xhu8_f_R9yrWzJ711M8RJ5O0ZrT_zG2elgu4iEu4jCu4imu4jhsq9htO5Q8u-wIAAA&expand=MTItMTEtMTAtNXwxMi0xMS0xMC01LTIwLTE2LTE1LTE0fDEyLTExLTEwLTUtMjAtMTktMTgtMTc

```bash
Line         = Entry { ";" Entry } .
Entry        = KeyValue | Number .
KeyValue     = Key ":" Number .
Key          = LetterOrUnderscore { LetterOrDigitOrUnderscore } .
Number       = [ "-" ] Digit { Digit } [ "." Digit { Digit } ] .

LetterOrUnderscore        = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" | "j" | "k" | "l" | "m" | "n" | "o" | "p" | "q" | "r" | "s" | "t" | "u" | "v" | "w" | "x" | "y" | "z"
                         | "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L" | "M" | "N" | "O" | "P" | "Q" | "R" | "S" | "T" | "U" | "V" | "W" | "X" | "Y" | "Z"
                         | "_" .
LetterOrDigitOrUnderscore = LetterOrUnderscore | Digit .
Digit        = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" .
```
