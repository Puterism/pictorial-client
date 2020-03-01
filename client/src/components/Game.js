import React, { useState, useEffect, useCallback } from 'react';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';
import useRoom from '../hooks/useRoom';

import Stars from '../svgs/Stars.svg';
import FindingMark from '../svgs/finding-mark.svg';
import FoundMark from '../svgs/found-mark.svg';
import ImageOwnerMark from '../svgs/image-owner-mark.svg';

import Alien1 from '../svgs/A1.png';
import Alien2 from '../svgs/A2.png';
import Alien3 from '../svgs/A3.png';
import Alien4 from '../svgs/A4.png';
import Alien5 from '../svgs/A5.png';
import Alien6 from '../svgs/A6.png';
import Alien7 from '../svgs/A7.png';
import Alien8 from '../svgs/A8.png';

const Styled = {
  Container: styled.div`
    width: 100%;
    height: 100%;
    background-image: url(${Stars});
    background-position: center;
    background-size: auto 100%;
    background-repeat: no-repeat;
    background-attachment: fixed;
  `,
  GameContainer: styled.div`
    width: 80%;
    margin: 0 auto;
  `,
  Header: styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,
  Round: styled.h2`
    font-size: 48px; 
    letter-spacing: 4.8px;
    font-weight: 800;
    color: #ffffff;
  `,
  Keyword: styled.h2`
    font-size: 48px;
    letter-spacing: 11.52px;
    font-weight: 800;
    color: #ffffff;
  `,
  Author: styled.h3`
    font-size: 24px;
    font-weight: 800;
    letter-spacing: 2.4px;
    color: #ffffff;
  `,
  ContentContainer: styled.div`
    /* display: flex;
    justify-content: space-between;
    align-items: top; */
    min-width: 1210px;
    height: 620px;
    text-align: center;
  `,
  UserList: styled.div`
    height: 100%;
    display: inline-block;
    vertical-align: top;
  `,
  UserStat: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: left;
    text-align: left;
  `,
  UserAlien: styled.div`
    background-image: ${props => `url(${props.alien})`};
    background-size: 100% 100%;
    background-position: center;
    width: 83px;
    height: 83px;
    margin-right: 14px;
  `,
  UserProfile: styled.div`
    display: flex;
    justify-content: left;
    flex-direction: column;
    margin-right: 25px;
    width: 200px;
  `,
  UserName: styled.h3`
    font-size: 20px;
    color: #c4c4c4;
    margin: 0;
  `,
  UserScore: styled.h3`
    font-size: 48px;
    font-weight: 300;
    letter-spacing: 6.24px;
    color: #ffffff;
    margin: 0;
  `,
  UserStatus: styled.div`
    width: 81px;
    height: 32px;
    background-image: ${props => {
      if (props.finding) return `url(${FindingMark})`;
      else if (props.found) return`url(${FoundMark})`;
      else if (props.owner) return `url(${ImageOwnerMark})`;
    }};
    background-position: left;
    background-repeat: no-repeat;
  `,
  Game: styled.div`
    display: inline-block;
  `,
  ImageBox: styled.div`
    width: 800px;
    height: 620px;
    box-shadow: 2px 4px 6px 0 rgba(0, 0, 0, 0.25);
    border-style: solid;
    border-width: 6px;
    border-image-source: linear-gradient(to right, #5728e2, #210081);
    border-image-slice: 1;
    background-color: rgba(0, 0, 0, 0.1);
    background-image: ${props => (
      props.image && `url(data:image/jpeg;base64,${props.image})`
    )};
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 100% 100%;
    position: relative;
    z-index: 3;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    box-sizing: border-box;
    color: white;
    font-size: 5em;
    cursor: pointer;
  `,
  AnswerArea: styled.div`
    position: absolute;
    width: ${props => {
      return `${(props.y2 - props.y1) * 100}%`
    }};
    height: ${props => {
      return `${(props.x2 - props.x1) * 100}%`
    }};
    top: ${props => `${props.x1 * 100}%`};
    left: ${props => `${props.y1 * 100}%`};
    border: ${props => props.show && `solid 6px #a806b5`};
  `,
  TimerContainer: styled.div`
    position: relative;
    top: 50px;
    width: 100%;
    float: none;
    clear: both;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,
  TimerText: styled.div`
    padding-right: 30px;
    font-size: 34px;
    color: #ffffff;
  `,
  TimerBar: styled.div`
    flex: 1;
    height: 30px;
    border-radius: 15px;
    background-color: #c4c4c4;
  `,
  TimerBarCurrent: styled.div`
    width: ${props => `${props.percentage}%`};
    height: 30px;
    border-radius: 15px;
    background-image: linear-gradient(to top, #a806b5, #5728e2);
  `,
}

let stopwatch;

function Game() {
  const { code, connected, userList, round, timeLimit, images, countdown, timer,
    nowRound, showImage, showAnswer,
    onSetGameReady, onClickedWrong, onClickedAnswer, } = useRoom();
  const [nowTime, setNowTime] = useState('0.000');
  const [startTime, setStartTime] = useState(null);


  useEffect(() => {
    onSetGameReady(code);    
  }, [onSetGameReady, code]);

  // const updateNowTime = useCallback(() => {
  //   const updatedTime = new Date().getTime();
  //   const diff = updatedTime - startTime;

  //   let seconds = Math.floor((diff % (1000 * 60)) / 1000);
  //   let milliseconds = Math.floor((diff % (1000 * 60)) / 100);
    
  //   seconds = (seconds < 10) ? "0" + seconds : seconds;
  //   milliseconds = (milliseconds < 100) ? (milliseconds < 10) ? "00" + milliseconds : "0" + milliseconds : milliseconds;
    
  //   setNowTime(`${seconds}.${milliseconds}`);
  // }, [startTime]);

  // useEffect(() => {
  //   // 게임이 시작됐을 때 스톱워치 시작
  //   if (countdown === 0) {
  //     setStartTime(new Date().getTime());
  //     console.log(startTime);
  //     // stopwatch = window.setInterval(updateNowTime, 100);
  //   }
  //   return () => clearInterval(stopwatch);
  // }, [countdown, startTime]);


  const handleClickAnswer = (e) => {
    if (showAnswer) return;
    e.stopPropagation();
    onClickedAnswer(3 - timer);
    // clearInterval(stopwatch);
    // setNowTime(0);
  }

  const handleClickWrong = () => {
    if (showAnswer) return;
    onClickedWrong(3 - timer);
  }

  // useEffect(() => {
  //   if (!nowTime) return;

  //   const timer = setInterval(() => {
  //     setNowTime(nowTime - 1);
  //   }, 1000);

  //   return () => clearInterval(timer);
  // }, [nowTime]);

  return (
    <Styled.Container>
      {
        !connected &&
        <Redirect to="/"></Redirect>
      }
      <Styled.GameContainer>
        <Styled.Header>
          { 
            nowRound && nowRound >= 1 && // TODO: nowRound 관련 에러 확인할 것 // onGameInProgress가 아님!
            <Styled.Round>
              { nowRound } / { round } ROUND
            </Styled.Round>
          }
          <Styled.Keyword>
            {
              nowRound && nowRound >= 1 ?
              <>
                { images[nowRound - 1].answerAuto.detection_names }
              </>
              : <>플레이어를 기다리는 중...</>
            }
          </Styled.Keyword>
          <Styled.Author>
            
            {
              nowRound && nowRound >= 1 &&
              <>
                By { images[nowRound - 1].name }
              </>
            }
            { nowTime }
          </Styled.Author>
        </Styled.Header>
        <Styled.ContentContainer>
          <Styled.UserList>
            {/* <Styled.UserStat>
              <Styled.UserAlien alien={Alien6} />
              <Styled.UserProfile>
                <Styled.UserName>KkiYubb</Styled.UserName>
                <Styled.UserScore>3010</Styled.UserScore>
              </Styled.UserProfile>
              <Styled.UserStatus owner />
            </Styled.UserStat> */}
            {
              userList.map((user) => (
                <Styled.UserStat key={user.id}>
                  { user.profile === 1 && <Styled.UserAlien alien={Alien1} /> }
                  { user.profile === 2 && <Styled.UserAlien alien={Alien2} /> }
                  { user.profile === 3 && <Styled.UserAlien alien={Alien3} /> }
                  { user.profile === 4 && <Styled.UserAlien alien={Alien4} /> }
                  { user.profile === 5 && <Styled.UserAlien alien={Alien5} /> }
                  { user.profile === 6 && <Styled.UserAlien alien={Alien6} /> }
                  { user.profile === 7 && <Styled.UserAlien alien={Alien7} /> }
                  { user.profile === 8 && <Styled.UserAlien alien={Alien8} /> }
                  <Styled.UserProfile>
                    <Styled.UserName>{user.name}</Styled.UserName>
                    <Styled.UserScore>{user.score}</Styled.UserScore>
                  </Styled.UserProfile>
                  {
                    (images[nowRound - 1] && images[nowRound - 1].name === user.name) ?
                    <Styled.UserStatus owner />
                    : 
                    <Styled.UserStatus finding />
                    

                  }
                </Styled.UserStat>
              ))
            }
          </Styled.UserList>

          <Styled.Game>
            <Styled.ImageBox
              onClick={handleClickWrong}
              image={
                nowRound && nowRound >= 1 && showImage && images[nowRound - 1].base64Img
              }
            >
              {
                (nowRound && nowRound >= 1 && showImage) ?
                <Styled.AnswerArea
                  onClick={handleClickAnswer}
                  show={showAnswer}
                  x1={images[nowRound - 1].answerAuto.detection_boxes[0]}
                  y1={images[nowRound - 1].answerAuto.detection_boxes[1]}
                  x2={images[nowRound - 1].answerAuto.detection_boxes[2]}
                  y2={images[nowRound - 1].answerAuto.detection_boxes[3]}
                />
                :
                countdown
              }
            </Styled.ImageBox>
          </Styled.Game>
        </Styled.ContentContainer>
        <Styled.TimerContainer>
          <Styled.TimerText>
            {
              timer >= 0 &&
              <>{timer} s</>
            }
          </Styled.TimerText>
          <Styled.TimerBar>
            <Styled.TimerBarCurrent percentage={(100 / timeLimit) * timer} />
          </Styled.TimerBar>
        </Styled.TimerContainer>
      </Styled.GameContainer>
    </Styled.Container>
  )
}

export default Game;