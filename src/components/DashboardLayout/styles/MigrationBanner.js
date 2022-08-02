import styled from "styled-components";

export default styled.div`
    height: 6rem;
    left: 0;
    top:0;
    position: sticky;
    width: 100%;
    z-index: 100;
    background: linear-gradient(95.78deg, rgba(75, 35, 194, 0.76) 0%, rgba(20, 82, 245, 0.56) 100%);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 2rem 4rem;
    @media (max-width: 978px) {
        flex-direction: column;
        align-items: center;
        height: 10rem;
    }
.blank {
    flex:1;
}
    .banner-message {
        color: white;
        font-size: 1.8rem;
    font-weight: 900;
    font-stretch: normal;
    font-style: normal;
    line-height: 2.2rem;
    text-align: center;
    flex: 5;
    }
    .banner-link {
        flex:1;
        color: white;
        font-size: 1.8rem;
    font-weight: 900;
    font-stretch: normal;
    font-style: normal;
    line-height: 2.2rem;
    text-align: center;
    width: 100%;
    text-decoration: underline;
    &:hover {
        cursor: pointer;
        opacity: 0.9;
        color: #e7eefe;
    }
    }
    .banner-link .small {
        font-size: 1.6rem;
    }
`;