# pokeapi

### Redirect PORT 80 to 3003
sudo iptables -t nat -I PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 3003
<br>
sudo iptables -I INPUT -p tcp --dport 3003 -j ACCEPT
