
export interface Player {
  name: string;
  games: number;
  points: number;
  fieldGoalPercentage: number;
  threePointPercentage: number;
  imageName: string;
  description?: string;
}

export const players = [
    {
      name: 'LeBron James',
      games: 1421,
      points: 38652,
      fieldGoalPercentage: 0.505,
      threePointPercentage: 0.345,
      imageName: 'lebron-james',
      description: `LeBron Raymone James Sr. (/ləˈbrɒn/ lə-BRON; born December 30, 1984) is an American professional basketball player for the Los Angeles Lakers of the National Basketball Association (NBA). Nicknamed "King James", he is widely recognized as one of the greatest players in the history of the sport and is often compared to Michael Jordan in debates over the greatest basketball player of all time.[a] He has competed in 10 NBA Finals (with eight consecutive appearances from 2011 to 2018) winning four NBA championships. He also won the inaugural NBA Cup in 2023 with the Lakers, and two Olympic gold medals as a member of the U.S. men's national team.`
    },
    {
      name: 'Kareem Abdul-Jabbar',
      games: 1560,
      points: 38387,
      fieldGoalPercentage: 0.559,
      threePointPercentage: 0.056,
      imageName: 'kareem-abdul-jabbar',
      description: `Kareem Abdul-Jabbar (/kəˈriːm æbˈduːl dʒəˈbɑːr/ kə-REEM ab-DOOL jə-BAR; born Ferdinand Lewis Alcindor Jr. (/ælˈsɪndər/ al-SIN-dər); April 16, 1947) is an American former professional basketball player who played 20 seasons in the National Basketball Association (NBA) for the Milwaukee Bucks and the Los Angeles Lakers. During his career as a center, Abdul-Jabbar was a record six-time NBA Most Valuable Player (MVP). He was a 19-time NBA All-Star—tied for the most ever—a 15-time All-NBA Team member, and an 11-time NBA All-Defensive Team selection. He was a member of six NBA championship teams as a player and two more as an assistant coach, and was twice voted the NBA Finals MVP. He was named to three NBA anniversary teams (35th, 50th, and 75th). Widely regarded as one of the greatest players of all time, he was called the greatest basketball player of all time by Pat Riley, Isiah Thomas, and Julius Erving. Abdul-Jabbar broke the NBA's career scoring record in 1984 and held it until it was broken in 2023 by LeBron James. Kareem Abdul-Jabbar (/kəˈriːm æbˈduːl dʒəˈbɑːr/ kə-REEM ab-DOOL jə-BAR; born Ferdinand Lewis Alcindor Jr. (/ælˈsɪndər/ al-SIN-dər); April 16, 1947) is an American former professional basketball player who played 20 seasons in the National Basketball Association (NBA) for the Milwaukee Bucks and the Los Angeles Lakers. During his career as a center, Abdul-Jabbar was a record six-time NBA Most Valuable Player (MVP). He was a 19-time NBA All-Star—tied for the most ever—a 15-time All-NBA Team member, and an 11-time NBA All-Defensive Team selection. He was a member of six NBA championship teams as a player and two more as an assistant coach, and was twice voted the NBA Finals MVP. He was named to three NBA anniversary teams (35th, 50th, and 75th). Widely regarded as one of the greatest players of all time, he was called the greatest basketball player of all time by Pat Riley, Isiah Thomas, and Julius Erving. Abdul-Jabbar broke the NBA's career scoring record in 1984 and held it until it was broken in 2023 by LeBron James.`
    },
    {
      name: 'Karl Malone',
      games: 1476,
      points: 36928,
      fieldGoalPercentage: 0.516,
      threePointPercentage: 0.274,
      imageName: 'karl-malone',
      description: `Karl Anthony Malone (born July 24, 1963)[1] is an American former professional basketball player in the National Basketball Association (NBA). Nicknamed "the Mailman", he is considered one of the greatest power forwards in NBA history. Malone spent his first 18 seasons (1985–2003) in the NBA with the Utah Jazz and formed a formidable duo with his teammate John Stockton. He was a two-time NBA Most Valuable Player, a 14-time NBA All-Star, and an 11-time member of the All-NBA first team. His 36,928 career points scored rank third all-time in NBA history behind LeBron James and Kareem Abdul-Jabbar, and he holds the records for most free throws made and attempted, and most regular season games started, in addition to being tied for the second-most first-team All-NBA selections with Kobe Bryant and behind LeBron James.`
    },
    {
      name: 'Kobe Bryant',
      games: 1346,
      points: 33643,
      fieldGoalPercentage: 0.447,
      threePointPercentage: 0.329,
      imageName: 'kobe-bryant',
      description: `Kobe Bean Bryant (/ˈkoʊbi/ KOH-bee; August 23, 1978 – January 26, 2020) was an American professional basketball player. A shooting guard, he spent his entire 20-year career with the Los Angeles Lakers in the National Basketball Association (NBA). Widely regarded as one of the greatest players in the history of the sport, Bryant won five NBA championships and was an 18-time All-Star, a 15-time member of the All-NBA Team, a 12-time member of the All-Defensive Team, the 2008 NBA Most Valuable Player (MVP), and a two-time NBA Finals MVP. Bryant also led the NBA in scoring twice and ranks fourth in league all-time regular season and postseason scoring. He was posthumously voted into the Naismith Memorial Basketball Hall of Fame in 2020 and named to the NBA 75th Anniversary Team in 2021.`
    },
    {
      name: 'Michael Jordan',
      games: 1072,
      points: 32292,
      fieldGoalPercentage: 0.497,
      threePointPercentage: 0.327,
      imageName: 'michael-jordan',
      description: `Michael Jeffrey Jordan (born February 17, 1963), also known by his initials MJ, is an American businessman and former professional basketball player. He played fifteen seasons in the National Basketball Association (NBA) from 1984 to 2003, winning six NBA championships with the Chicago Bulls. He was integral in popularizing the sport of basketball and the NBA around the world in the 1980s and 1990s, becoming a global cultural icon. His profile on the official NBA website states that "by acclamation, Michael Jordan is the greatest basketball player of all time."`
    },
    {
      name: 'Dirk Nowitzki',
      games: 1522,
      points: 31560,
      fieldGoalPercentage: 0.471,
      threePointPercentage: 0.38,
      imageName: 'dirk-nowitzki',
      description: `Dirk Werner Nowitzki (German pronunciation: [ˈdɪʁk noˈvɪtski], audio; born June 19, 1978) is a German former professional basketball player who is a special advisor for the Dallas Mavericks of the National Basketball Association (NBA). Listed at 7 ft 0 in (2.13 m), he is widely regarded as one of the greatest power forwards of all time and is considered by many to be the greatest European player of all time. In 2021, he was selected to the NBA 75th Anniversary Team. In 2023, Nowitzki was inducted into the Naismith Memorial Basketball Hall of Fame.`
    },
    {
      name: 'Wilt Chamberlain',
      games: 1045,
      points: 31419,
      fieldGoalPercentage: 0.54,
      threePointPercentage: 0,
      imageName: 'wilt-chamberlain',
      description: `Wilton Norman Chamberlain (/ˈtʃeɪmbərlɪn/ CHAYM-bər-lin; August 21, 1936 – October 12, 1999) was an American professional basketball player. Standing 7 ft 1 in (2.16 m) tall, he played center in the National Basketball Association (NBA) for 14 seasons and is widely regarded as one of the sport's greatest players. Chamberlain was enshrined in the Naismith Memorial Basketball Hall of Fame in 1978 and elected to the NBA's 35th, 50th, and 75th anniversary teams. Following his professional basketball career, Chamberlain played volleyball in the short-lived International Volleyball Association (IVA). He served one term as league president and is enshrined in the IVA Hall of Fame. Renowned for his strength, he played the antagonist in the 1984 Arnold Schwarzenegger film Conan the Destroyer.`
    },
    {
      name: 'Shaquille O\'Neal',
      games: 1207,
      points: 28596,
      fieldGoalPercentage: 0.582,
      threePointPercentage: 0.045,
      imageName: 'shaquille-oneal',
      description: `Shaquille Rashaun O'Neal (/ʃəˈkiːl/ shə-KEEL; born March 6, 1972), known commonly as Shaq (/ʃæk/ SHAK), is an American former professional basketball player who is a sports analyst on the television program Inside the NBA. He is a 7-foot-1-inch (2.16 m) and 325-pound (147 kg) center who played for six teams over his 19-year career in the National Basketball Association (NBA) and is a four-time NBA champion. O'Neal is regarded as one of the greatest basketball players and centers of all time.`
    },
    {
      name: 'Carmelo Anthony',
      games: 1260,
      points: 28289,
      fieldGoalPercentage: 0.447,
      threePointPercentage: 0.355,
      imageName: 'carmelo-anthony',
      description: `Carmelo Kyam Anthony (/kɑːrˈmɛloʊ/ kar-MEL-oh; born May 29, 1984) is an American former professional basketball player. Anthony played 19 seasons in the National Basketball Association (NBA) and was named an NBA All-Star ten times and an All-NBA Team member six times. He played college basketball for the Syracuse Orange, winning a national championship as a freshman in 2003 while being named the NCAA Tournament's Most Outstanding Player. In 2021, he was named to the NBA 75th Anniversary Team, and is regarded as one of the greatest scorers in NBA history.`
    },
    {
      name: 'Moses Malone',
      games: 1329,
      points: 27409,
      fieldGoalPercentage: 0.491,
      threePointPercentage: 0.10,
      imageName: 'moses-malone',
      description: `Moses Eugene Malone Sr. (March 23, 1955 – September 13, 2015) was an American professional basketball player who played in both the American Basketball Association (ABA) and the National Basketball Association (NBA) from 1974 through 1995. A center, he was named the NBA Most Valuable Player (MVP) three times, was a 12-time NBA All-Star and an eight-time All-NBA Team selection. Malone led the Philadelphia 76ers to an NBA championship in 1983, winning both the league and Finals MVP. He was inducted into the Naismith Memorial Basketball Hall of Fame in his first year of eligibility in 2001. Widely regarded as one of the greatest players in the sport's history, Malone is also seen as one of the most underrated NBA players.`
    },
    {
      name: 'Elvin Hayes',
      games: 1303,
      points: 27313,
      fieldGoalPercentage: 0.452,
      threePointPercentage: 0.147,
      imageName: 'elvin-hayes',
      description: `Elvin Ernest Hayes (born November 17, 1945), nicknamed "the Big E", is an American former professional basketball player and radio analyst for his alma mater Houston Cougars. He is a member of the NBA's 50th and 75th anniversary teams, and an inductee in the Naismith Memorial Basketball Hall of Fame. Known for both his offensive and defensive prowess, Hayes is often regarded as one of the best power forwards in NBA history. Hayes is also known for his longevity, being third all-time in NBA minutes played (at exactly 50,000), and missing only nine games during his 16-season career.`
    }
  ]