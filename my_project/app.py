from flask import Flask, render_template,url_for

app = Flask(__name__)

@app.route("/")
def home():
    """ page home """
    return render_template("Home.html")

@app.route("/dashboard")
def dashboard():
    """ page dashboard """
    return render_template("Dashboard.html")

@app.route("/courses")
def courses():
    """ page Courses """
    return render_template("Courses.html")

@app.route("/simulation")
def simulation():
    """ page Simulation """
    return render_template("Simulation.html")

if __name__ == "__main__":
    app.run(debug=True, port=8000, host="0.0.0.0", use_reloader=True)
