# pokeapi

### Redirect PORT 80 to 3003
sudo iptables -t nat -I PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 8080
<br>
sudo iptables -I INPUT -p tcp --dport 8080 -j ACCEPT
