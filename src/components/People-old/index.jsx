import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLongArrowAltRight, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { Info } from "components/Dashboard-old/styles";
import { SideNavContext } from "context/SideNavContext";
import { Card } from "components/common/Card";
import Button from "components/common/Button";
import viewTeamsReducer from "store/view-teams/reducer";
import { getTeams } from "store/view-teams/actions";
import viewTeamsSaga from "store/view-teams/saga";
import {
  makeSelectTeams,
  makeSelectPeopleCount,
  makeSelectLoading,
} from "store/view-teams/selectors";
import { useInjectReducer } from "utils/injectReducer";
import { useInjectSaga } from "utils/injectSaga";
import { makeSelectOwnerSafeAddress } from "store/global/selectors";
import Loading from "components/common/Loading";

import TeamMembersPng from "assets/images/team-members.png";
import TeamPng from "assets/images/user-team.png";

import { Container, AllEmployees } from "./styles";
import { Circle } from "components/Header/styles";

const viewTeamsKey = "viewTeams";

export default function People() {
  // Normal users and New users have different UI at first
  const [isNormalUser, setIsNormalUser] = useState();
  const [toggled] = useContext(SideNavContext);

  useInjectReducer({
    key: viewTeamsKey,
    reducer: viewTeamsReducer,
  });

  useInjectSaga({ key: viewTeamsKey, saga: viewTeamsSaga });

  const dispatch = useDispatch();
  const allDepartments = useSelector(makeSelectTeams());
  const totalEmployees = useSelector(makeSelectPeopleCount());
  const loading = useSelector(makeSelectLoading());
  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());

  useEffect(() => {
    dispatch(getTeams(ownerSafeAddress));
  }, [dispatch, ownerSafeAddress]);

  useEffect(() => {
    if (allDepartments && allDepartments.length > 0) {
      setIsNormalUser(true);
    } else {
      setIsNormalUser(false);
    }
  }, [allDepartments]);

  const renderForNewUser = () => {
    return (
      <div>
        <Info>
          <div
            style={{
              maxWidth: toggled ? "900px" : "1200px",
              transition: "all 0.25s linear",
            }}
            className="mx-auto"
          >
            <div className="title">People</div>
            <div className="subtitle">You can add teams and manage payouts</div>
          </div>
        </Info>
        <Container
          style={{
            maxWidth: toggled ? "900px" : "1200px",
            transition: "all 0.25s linear",
          }}
        >
          <div className="new-user">
            <Card className="p-4" style={{ minHeight: "532px" }}>
              <div className="text-center">
                <img src={TeamMembersPng} alt="humans" width="400px" />
              </div>
              <div className="card-title">
                Hassle-Free Team and People management
              </div>
              <div className="card-subtitle">
                Add teams and manage people with easy imports.
              </div>

              <Button
                iconOnly
                className="d-block mx-auto"
                to="/dashboard/people/new"
              >
                <div className="circle">
                  <FontAwesomeIcon icon={faPlus} color="#fff" />
                </div>
                <div className="add-now">Add Now</div>
              </Button>
            </Card>
          </div>
        </Container>
      </div>
    );
  };

  const renderForNormalUser = () => {
    return (
      <div>
        <Info>
          <div
            style={{
              maxWidth: toggled ? "900px" : "1200px",
              transition: "all 0.25s linear",
            }}
            className="mx-auto"
          >
            <div className="title">Your Teams</div>
            <div className="subtitle">Manage Teams and People within them.</div>
            <Button large iconOnly className="p-0" to="/dashboard/people/view">
              <AllEmployees>
                <div>
                  <div className="all-employees-title mb-4">All Teammates</div>
                  <div className="all-employees-subtitle mb-2">
                    Total Teammates : <span>{totalEmployees}</span>
                  </div>
                  <div className="all-employees-subtitle">
                    Total Teams :{" "}
                    <span>
                      {(allDepartments && allDepartments.length) || 0}
                    </span>
                  </div>
                </div>
                <div>
                  <Circle>
                    <FontAwesomeIcon icon={faLongArrowAltRight} color="#fff" />
                  </Circle>
                </div>
              </AllEmployees>
            </Button>
          </div>
        </Info>
        <Container
          className="show-departments"
          style={{
            maxWidth: toggled ? "900px" : "1200px",
            transition: "all 0.25s linear",
          }}
        >
          <div
            className="department-cards"
            style={{
              gridTemplateColumns: toggled
                ? "repeat(3, 1fr)"
                : "repeat(4, 1fr)",
            }}
          >
            {allDepartments &&
              allDepartments.map(({ departmentId, name, employees }) => (
                <Link
                  to={`/dashboard/people/view/${departmentId}`}
                  key={departmentId}
                >
                  <Card className="department-card">
                    <div className="upper">
                      <div className="d-flex justify-content-between">
                        <img src={TeamPng} alt={name} width="50" />
                        <div className="circle circle-grey">
                          <FontAwesomeIcon
                            icon={faLongArrowAltRight}
                            color="#7367f0"
                          />
                        </div>
                      </div>
                      <div className="mt-2">{name}</div>
                    </div>

                    <div className="line" />
                    <div className="lower">
                      <div>Teammates : {employees}</div>
                    </div>
                  </Card>
                </Link>
              ))}
            <Link to={`/dashboard/department/new`}>
              <Card className="department-card d-flex justify-content-center align-items-center">
                <Button iconOnly className="d-block mx-auto">
                  <div className="circle">
                    <FontAwesomeIcon icon={faPlus} color="#fff" />
                  </div>
                  <div className="add-now">Add Team</div>
                </Button>
              </Card>
            </Link>
          </div>
        </Container>
      </div>
    );
  };

  return (
    <div
      className="position-relative"
      style={{
        transition: "all 0.25s linear",
      }}
    >
      {loading ? (
        <div>
          <Info></Info>
          <Container className="show-departments">
            <div
              className="d-flex align-items-center justify-content-center"
              style={{ height: "300px" }}
            >
              <Loading color="primary" width="50px" height="50px" />
            </div>
          </Container>
        </div>
      ) : isNormalUser ? (
        renderForNormalUser()
      ) : (
        renderForNewUser()
      )}
    </div>
  );
}
